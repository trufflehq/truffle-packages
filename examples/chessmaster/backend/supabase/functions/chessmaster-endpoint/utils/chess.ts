import { SubscriptionLike } from "https://deno.land/x/observable@v0.1-alpha/Subscription.ts";
import { NDJSONObservable } from "./ndjson.ts";
import { createPoll, getCurrentPoll } from "./polls.ts";
import { Poll } from "./types.ts";

class MoveExecutor {
  private _scheduledMoves: Set<string> = new Set();

  queueMove(poll: Poll, matchBot: ChessMatchBot) {
    // we don't want to queue up the same move twice
    if (this._scheduledMoves.has(poll.id)) return;

    console.log("queueing move for poll", poll.id);
    // mark this as a scheduled move
    this._scheduledMoves.add(poll.id);

    // schedule our move to execute when the poll ends
    const endDate = new Date(poll.endTime);
    const millisUntilMove = endDate.getTime() - Date.now();
    setTimeout(async () => {
      const currentPoll = await getCurrentPoll(poll.orgId);
      // sort the options in descending order based on vote count
      const options = currentPoll.options.sort((a, b) => b.count - a.count);
      // use the first option (the option with most votes) as the winning option
      const winningOption = options[0];
      console.log("making move", winningOption.text, poll.id);
      await matchBot.makeMove(winningOption.text)
    }, millisUntilMove);
  }
}

export const moveExecutor = new MoveExecutor();

type LichessIncomingEventStreamType =
  | "challenge"
  | "gameStart"
  | "gameFinish"
  | "challengeCanceled"
  | "challengeDeclined";

// interface from lichess api
// https://lichess.org/api#operation/apiStreamEvent
interface LichessIncomingStreamEvent {
  type: LichessIncomingEventStreamType;
  game: LichessGame;
  challenge: Record<string, any>;
}

// interface from lichess api
// https://lichess.org/api#operation/accountMe
interface LichessProfile {
  id: string;
  name: string;
  title: any;
  rating: number;
  provisional: boolean;
  online: boolean;
}

// interface from lichess api
// https://lichess.org/api#operation/apiStreamEvent
interface LichessGame {
  fullId: string;
  gameId: string;
  fen: string;
  id: string;
  color: "black" | "white";
  lastMove: string;
  hasMoved: boolean;
  opponent: LichessProfile;
  isMyTurn: boolean;
}

interface LichessGameState {
  type: "gameState";
  moves: string;
}

interface LichessBotGameStreamEvent {
  type: "gameFull" | "gameState" | "chatLine";
  id: string;
  moves: string;
  text: string;
  username: string;
  state: LichessGameState;
}

// this class is used to manage/accept challenges
export class ChessGameManager {
  private _chessMatches: Map<string, ChessMatchBot> = new Map();

  constructor(private _apiToken: string) {
    this._createEventStream().then((resp) => {
      if (!resp.body) {
        throw new Error(
          "resp.body was undefined when trying to create lichess event stream"
        );
      }
      const eventObs = new NDJSONObservable(resp.body.getReader());
      eventObs.subscribe(this._streamEventHandler.bind(this));
      console.log('Listening for lichess events...')
    });
  }

  getMatchBotById(id: string) {
    return this._chessMatches.get(id);
  }

  // initializes a lichess event stream using the fetch api
  private _createEventStream() {
    return fetch("https://lichess.org/api/stream/event", {
      headers: this._authHeaders,
    });
  }

  private async _acceptChallenge(gameId: string) {
    const url = `https://lichess.org/api/challenge/${gameId}/accept`;
    const respBody = await fetch(url, {
      method: "POST",
      headers: this._authHeaders,
    }).then((resp) => resp.json());

    if (!respBody?.ok) {
      console.error(
        `Could not accept challenge; lichess returned ${JSON.stringify(
          respBody
        )}`
      );
    } else {
      console.log("accepted challenge", gameId);
    }
  }

  private _startMatch(game: LichessGame) {
    this._chessMatches.set(game.id, new ChessMatchBot(this._apiToken, game));
  }

  private get _authHeaders() {
    return new Headers([["Authorization", `Bearer ${this._apiToken}`]]);
  }

  private _streamEventHandler(event: LichessIncomingStreamEvent) {
    switch (event.type) {
      case "challenge": {
        const challenger = event.challenge?.challenger;
        console.log(
          `received challenge ${event.challenge.id} from`,
          challenger
        );
        this._acceptChallenge(event.challenge.id);
        break;
      }

      case "gameStart": {
        console.log("starting game", event.game);
        this._startMatch(event.game);
        break;
      }

      default: {
        console.error("unknown event type received", event);
      }
    }
  }
}

// this class is used to play a chess match;
// one of these gets initialized per match
class ChessMatchBot {
  private _eventSubscription?: SubscriptionLike;
  private _isWaitingToCreatePoll = false;
  private _isWhite: boolean;

  public truffleOrgId?: string;

  constructor(private _apiToken: string, private _game: LichessGame) {
    this._isWaitingToCreatePoll = this._game.isMyTurn
    this._isWhite = this._game.color === 'white'
    this._createEventStream().then((resp) => {
      if (!resp.body) {
        console.error(
          "resp.body was undefined when trying to create lichess game event stream"
        );
        return;
      }
      const eventObs = new NDJSONObservable(resp.body.getReader());
      this._eventSubscription = eventObs.subscribe(
        this._streamEventHandler.bind(this),
        (e) => {
          console.error(
            `Error inside of game stream ${this._game.id}: ${JSON.stringify(e)}`
          );
        },
        () => {
          console.log(`stream completed for game ${this._game.id}`);
        }
      );
    });
  }

  private get _authHeaders() {
    return new Headers([["Authorization", `Bearer ${this._apiToken}`]]);
  }

  private _createEventStream() {
    const url = `https://lichess.org/api/bot/game/stream/${this._game.id}`;
    return fetch(url, { headers: this._authHeaders });
  }

  private async _streamEventHandler(event: LichessBotGameStreamEvent) {
    switch (event.type) {
      case "gameFull": {
        console.log(event.type, event)
        const moves = generateMovesArr(event.state.moves)
        const isMyTurn = this._isWhite
          ? moves.length % 2 === 0
          : moves.length % 2 === 1

        if (isMyTurn) {
          await this.tryCreatePoll();
        }
        break;
      }


      case "gameState": {
        console.log(event.type, event)
        const moves = generateMovesArr(event.moves)
        const isMyTurn = this._isWhite
          ? moves.length % 2 === 0
          : moves.length % 2 === 1

        if (isMyTurn) {
          await this.tryCreatePoll();
        }
        break;
      }

      case "chatLine": {
        console.log("chatLine", event);

        if (event.username !== this._game.opponent.id) break;

        const setOrgRegex = /:set-org:(?<orgId>[^:]*)/;

        if (event.text === ":resign") {
          await this.sendChat("Ok, I'll resign.");
          await this.resign();

        } else if (setOrgRegex.test(event.text)) {
          const match = event.text.match(setOrgRegex);
          const orgId = match?.groups?.orgId;
          this.truffleOrgId = orgId;

          console.log(`setting org id to ${orgId} for game ${this._game.id}`);
          await this.sendChat(`Thanks! I set your Truffle Org ID to ${orgId}`);

          if (this._isWaitingToCreatePoll) {
            await createPoll(this.truffleOrgId!)
            this._isWaitingToCreatePoll = false;
          }
        } else if (event.text === ':create-poll') {
          await this.tryCreatePoll();
        }
        break;
      }
    }
  }

  async sendChat(message: string) {
    const url = `https://lichess.org/api/bot/game/${this._game.id}/chat`;
    const headers = this._authHeaders;
    headers.set("content-type", "application/x-www-form-urlencoded");
    const respBody = await fetch(url, {
      headers,
      method: "POST",
      body: encodeFormData({ text: message, room: "player" }),
    }).then((resp) => resp.json());

    if (!respBody?.ok) {
      console.error(
        `Error while sending chat ${this._game.id}: ${JSON.stringify(respBody)}`
      );
    }
  }

  async resign() {
    const url = `https://lichess.org/api/bot/game/${this._game.id}/resign`;
    const respBody = await fetch(url, {
      headers: this._authHeaders,
      method: "POST",
    }).then((resp) => resp.json());

    if (!respBody?.ok) {
      console.error(
        `Error while resigning from game ${this._game.id}: ${JSON.stringify(
          respBody
        )}`
      );
    }
  }

  async tryCreatePoll() {
    if (!this.truffleOrgId) {
      this._isWaitingToCreatePoll = true;
      await this.sendChat("I need you to tell me your Truffle Org ID with ':set-org:<ORG_ID>' in the chat.")
    } else {
      await createPoll(this.truffleOrgId)
    }
  }

  async makeMove(move: string) {
    const url = `https://lichess.org/api/bot/game/${this._game.id}/move/${move}`;
    const respBody = await fetch(url, {
      headers: this._authHeaders,
      method: "POST",
    }).then((resp) => resp.json());

    // todo: should probably do some more intelligent handling of bad moves
    if (!respBody?.ok) {
      console.error(
        `Error while making a move for game ${this._game.id}: ${JSON.stringify(
          respBody
        )}`
      );
      console.error('gonna try to create another Truffle poll')
      await this.tryCreatePoll()
    }
  }
}

const encodeFormData = (data: Record<string, any>) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const generateMovesArr = (moves: string) => moves.split(' ').filter(move => move.length === 4)
