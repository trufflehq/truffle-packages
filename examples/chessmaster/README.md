# Chessmaster

## Overview

If you'd like to see Chessmaster in action, check out the video: https://www.youtube.com/watch?v=7KhOfh42-Sk

Chessmaster is a Truffle Package that facilitates a game of chess between a streamer and their audience. The basic flow is as follows:

- On the streamer's turn, the streamer simply plays a turn.
- On the audience's turn, "Truffle Bot" will create a poll.
  - While this poll is live, audience members can nominate a move by redeeming the "Make a move" collectible.
  - Audience members can vote on nominated moves.
- The poll will last for 60 seconds. After 60 seconds, Truffle Bot will make the move with the most votes.

## Usage

### Setup

Luckily, there's not much setup for you to use Chessmaster on your own org! Simply run
```
truffle-cli install @dev/chessmaster
```
to install the package to your org. (Make sure you're authenticated by previously running `truffle-cli auth <key>`).

### Creating a game

If you haven't already, go to https://lichess.org and create an account.

To start a game, click the "Play with a friend" button on the home page. It will let you select the variant and time control and ask you if you want to play black or white or be randomly chosen.

After you configure your game, it will bring you to a page that helps you invite your opponent. Under the "Invite a Lichess user" box, search for `truffleBot1`. After clicking `truffleBot1`, it will send Truffle Bot a challenge and wait for him to accept. Sometimes, Truffle Bot goes to sleep, so he might not accept your challenge immediately.

Regardless of whether or not Truffle Bot accepts your challenge, go to https://package-version-15a26530-087a-11ed-8a59-63659f4ae967.sporocarp.dev/set-game to finish setting up.

Grab the game ID from the Lichess url (should be in the format `https://lichess.org/<GAME_ID>` or `https://lichess.org/challenge/<GAME_ID>`) and paste it into the input box under "Current Game ID" in the setup page. Be sure to click "Set" to set the game ID.

If Truffle Bot hasn't accepted your challenge, it's probably because he's asleep. Click "Wake up Truffle Bot" to wake him up. He should accept your challenge shortly after.

On the setup page, there will be a string that you can copy in the format `:set-org:<ORG_ID>`. Copy that string and paste it into the chat in Lichess. Truffle Bot should respond by saying that he got the org ID.

Now share the following link with your audience and they can begin nominating and voting on moves for Truffle Bot!

https://package-version-15a26530-087a-11ed-8a59-63659f4ae967.sporocarp.dev/

## Issues/Troubleshooting

### Truffle Bot won't accept my challenge or seems unresponsive

Chances are, Truffle Bot went to sleep. He likes to do that from time to time. Go to https://package-version-15a26530-087a-11ed-8a59-63659f4ae967.sporocarp.dev/set-game to wake him up.

### It's Truffle Bot's turn, but he didn't create a poll for my audience

Truffle Bot isn't perfect; he makes mistakes too (or rather, the dev who created him. cough cough, fay). Send `:create-poll` in the Lichess chat to get him to create a poll.

### I want to end the game, but I don't want to hurt my chess rating

Hmmmmm... that seems like a sketchy request... but Truffle Bot doesn't care about his reputation. He'll gladly resign if you send `:resign` in the Lichess chat.

## Rolling your own Truffle Bot

Truffle Bot is capable of handling multiple games from multiple different orgs simultaneously, so there's not much of a reason to create another instance of him. However, if you'd like to modify his code or extend his functionality, you can dive into the `backend` directory of this example. There, you will find all the code for Truffle Bot and a `README.md` to get you started. Be sure to change `TRUFFLE_BOT_URL` in `config.ts` if you host your own Truffle Bot.

## Forking Chessmaster

If you fork the Chessmaster package, be sure to set the appropriate values inside of `config.ts`.