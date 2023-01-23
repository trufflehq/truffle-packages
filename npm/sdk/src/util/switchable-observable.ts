import { toObservable } from "wonka";

type Observable<T> = ReturnType<typeof toObservable<T>>;
type ObservableSubscription<T> = ReturnType<Observable<T>["subscribe"]>;
type ObservableObserver<T> = Parameters<Observable<T>["subscribe"]>[0];

export class SwitchableObservable<T> implements Observable<T> {

  private _observers: ObservableObserver<T>[] = [];
  private _subscription: ObservableSubscription<T> | null = null;

  constructor(private _observable: Observable<T>) {
    // normally we would subscribe to the observable here,
    // but we don't want to do that until someone subscribes to this observable.
    // so we'll do it in the subscribe method.
  }

  private _subscribeToObservable () {
    this._subscription = this._observable.subscribe({
      next: (value) => {
        this._observers.forEach((observer) => {
          observer.next(value);
        });
      },
      error: (err) => {
        this._observers.forEach((observer) => {
          observer.error(err);
        });
      },
      complete: () => {
        this._observers.forEach((observer) => {
          observer.complete();
        });
      },
    });
  }

  public subscribe(observer: ObservableObserver<T>): ObservableSubscription<T> {
    this._observers.push(observer);

    // make sure we re-subscribe to the underlying observable if there's no subscription
    if (!this._subscription) {
      this._subscribeToObservable();
    }

    let closed = false;
    return {
      unsubscribe: () => {
        this._observers = this._observers.filter((o) => o !== observer);
        closed = true;
        if (this._observers.length === 0) {
          this._subscription?.unsubscribe();
          this._subscription = null;
        }
      },
      get closed(){
        return closed;
      },
    }
  }

  /**
   * Switches the underlying observable to the given observable.
   */
  public switch(observable: Observable<T>) {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }

    this._observable = observable;
    this._subscribeToObservable();
  }

}