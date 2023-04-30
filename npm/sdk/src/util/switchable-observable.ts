import {
  Observable,
  ObservableObserver,
  ObservableSubscription,
} from '../types/observable';

export class SwitchableObservable<T> implements Observable<T> {
  private _observers: ObservableObserver<T>[] = [];
  private _subscription: ObservableSubscription | null = null;
  private _latestValue?: T;
  private _hasGottenFirstValue = false;

  constructor(private _observable: Observable<T>) {
    // normally we would subscribe to the observable here,
    // but we don't want to do that until someone subscribes to this observable.
    // so we'll do it in the subscribe method.
  }

  private _subscribeToObservable() {
    this._subscription = this._observable.subscribe({
      next: (value) => {
        this._hasGottenFirstValue = true;
        this._latestValue = value;
        this._observers.forEach((observer) => {
          observer.next(value);
        });
      },
      error: (err) => {
        this._observers.forEach((observer) => {
          observer.error?.(err);
        });
      },
      complete: () => {
        this._observers.forEach((observer) => {
          observer.complete?.();
        });
      },
    });
  }

  public subscribe(observer: ObservableObserver<T>): ObservableSubscription {
    // make sure we re-subscribe to the underlying observable if there's no subscription
    if (!this._subscription) {
      this._subscribeToObservable();
    }

    this._observers.push(observer);

    // only send the latest value if we've already gotten one
    if (this._hasGottenFirstValue) {
      // send the latest value to the new observer
      observer.next(this._latestValue as T);
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
      get closed() {
        return closed;
      },
    };
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
