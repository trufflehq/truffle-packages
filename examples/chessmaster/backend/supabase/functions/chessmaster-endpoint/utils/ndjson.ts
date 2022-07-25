import { Observable } from "https://deno.land/x/observable@v0.1-alpha/Observable.ts";
import { Observer } from "https://deno.land/x/observable@v0.1-alpha/Observer.ts";
import { SubscriptionLike } from "https://deno.land/x/observable@v0.1-alpha/Subscription.ts";

// deno-lint-ignore no-explicit-any
export class NDJSONObservable extends Observable<any> {
  constructor(private _reader: ReadableStreamReader<any>) {
    super((observer) => {
      let buffer = "";
      const processText = ({ value }: ReadableStreamReadResult<Uint8Array>) => {
        buffer += new TextDecoder("utf-8").decode(value);

        // sometimes it decides to dump a bunch of newlines
        // on us, so we have to get rid of all of them
        let idxOfNewline: number;
        do {
          idxOfNewline = buffer.indexOf("\n");

          if (idxOfNewline !== -1) {
            const objStr = buffer.slice(0, idxOfNewline);
            const remainingStr = buffer.slice(idxOfNewline + 1);

            if (objStr.length > 0) {
              const obj = JSON.parse(objStr);
              observer.next(obj);
            }

            buffer = remainingStr;
          }
        } while (idxOfNewline !== -1);
      }

      const read = async () => {
        try {
          let res = await this._reader.read();
          do {
            processText(res);
            res = await this._reader.read();
          } while (!res.done);
        } catch (e) {
          if (e.message !== 'The reader was released.') {
            observer.error(e)
          }
        }

        observer.complete();
      }

      read()
    });
  }

  subscribe(
    observerOrOnNext: Observer<any> | ((value: any) => void),
    onError?: (error: unknown) => void,
    onComplete?: () => void,
  ): SubscriptionLike {
    const subscriber = super.subscribe(observerOrOnNext as any, onError, onComplete)
    
    const oldUnsub = subscriber.unsubscribe.bind(this)
    subscriber.unsubscribe = () => {
      this._reader.releaseLock()
      oldUnsub()
    }

    return subscriber
  }
}
