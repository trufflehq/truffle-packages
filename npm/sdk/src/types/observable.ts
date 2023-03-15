/** A definition of the ES Observable Subscription type that is returned by
 * {@link Observable.subscribe}
 *
 * @remarks
 * The Subscription in ES Observables is a handle that is held while the Observable is actively
 * streaming values. As such, it's used to indicate with {@link ObservableSubscription.closed}
 * whether it's active, and {@link ObservableSubscription.unsubscribe} may be used to cancel the
 * ongoing subscription and end the {@link Observable} early.
 *
 * @see {@link https://github.com/tc39/proposal-observable} for the ES Observable specification.
 */
export interface ObservableSubscription {
  /** A boolean flag indicating whether the subscription is closed.
   * @remarks
   * When `true`, the subscription will not issue new values to the {@link ObservableObserver} and
   * has terminated. No new values are expected.
   *
   * @readonly
   */
  closed?: boolean;
  /** Cancels the subscription.
   * @remarks
   * This cancels the ongoing subscription and the {@link ObservableObserver}'s callbacks will
   * subsequently not be called at all. The subscription will be terminated and become inactive.
   */
  unsubscribe(): void;
}

/** A definition of the ES Observable Observer type that is used to receive data from an
 * {@link Observable}.
 *
 * @remarks
 * The Observer in ES Observables is supplied to {@link Observable.subscribe} to receive events from
 * an {@link Observable} as it issues them.
 *
 * @see {@link https://github.com/tc39/proposal-observable#observer} for the ES Observable
 * specification of an Observer.
 */
export interface ObservableObserver<T> {
  /** Callback for the Observable issuing new values.
   * @param value - The value that the {@link Observable} is sending.
   */
  next(value: T): void;
  /** Callback for the Observable encountering an error, terminating it.
   * @param error - The error that the {@link Observable} has encountered.
   */
  error?(error: any): void;
  /** Callback for the Observable ending, after all values have been issued. */
  complete?(): void;
}

/** An ES Observable type that is a de-facto standard for push-based data sources across the JS
 * ecosystem.
 *
 * @remarks
 * The Observable is often used by multiple libraries supporting or creating streams to provide
 * interoperability for push-based streams. As Wonka's {@link Source | Sources} are similar in
 * functionality to Observables, it provides utilities to cleanly convert to and from Observables.
 *
 * @see {@link https://github.com/tc39/proposal-observable} for the ES Observable specification.
 */
export interface Observable<T> {
  /** Subscribes to new signals from an {@link Observable} via callbacks.
   * @param observer - An object containing callbacks for the various events of an Observable.
   * @returns Subscription handle of type {@link ObservableSubscription}.
   *
   * @see {@link ObservableObserver} for the callbacks in an object that are called as Observables
   * issue events.
   */
  subscribe(observer: ObservableObserver<T>): ObservableSubscription;
}
