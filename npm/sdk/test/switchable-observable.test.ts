import { SwitchableObservable } from '../src/util/switchable-observable';
import { Observable, from, Subject } from 'rxjs';

const createObservable = (value: string) => {
  return from([value]);
}

describe('SwitchableObservable', () => {

  let switchableObs: SwitchableObservable<string>;
  let obs1: Observable<string>;
  let obs2: Observable<string>;
  beforeEach(() => {
    obs1 = createObservable('obs1');
    obs2 = createObservable('obs2');
    switchableObs = new SwitchableObservable(obs1);
  })

  it('should subscribe to an observable', async () => {
    let subscription: any;
    const result = await new Promise<string>((resolve) => {
      subscription = switchableObs.subscribe({
        next: (value) => {
          resolve(value);
        },
        error: (err) => {
          throw err;
        },
        complete: () => {}
      });
    });

    // make sure we get the correct result
    expect(result).toEqual('obs1');
    subscription?.unsubscribe();
  });

  it('should unsubscribe from an observable', async () => {
    let subscription: any;
    const result = await new Promise<string>((resolve) => {
      subscription = switchableObs.subscribe({
        next: (value) => {
          resolve(value);
        },
        error: (err) => {
          throw err;
        },
        complete: () => {}
      });
    });

    // subscription should stay open until we unsubscribe
    expect(subscription.closed).toEqual(false);
    expect(switchableObs['_subscription']).not.toEqual(null);
    expect(switchableObs['_observers'].length).toEqual(1);

    subscription?.unsubscribe();
    expect(subscription.closed).toEqual(true);
    expect(switchableObs['_subscription']).toEqual(null);
    expect(switchableObs['_observers'].length).toEqual(0);
  });

  it('should switch to a new observable', async () => {
    let subscription: any;
    const resultProm = new Promise<string>((resolve) => {
      subscription = switchableObs.subscribe({
        next: (value) => {
          if (value === 'obs2')
            resolve(value);
        },
        error: (err) => {
          throw err;
        },
        complete: () => {}
      });
    });


    // switch the observable and get the result
    switchableObs.switch(obs2);
    const result = await resultProm;

    // make sure we get the correct result
    expect(result).toEqual('obs2');
    subscription?.unsubscribe();
  });

  it('should wait for the first value if a consumer subscribes before the first value is emitted', async () => {
    let subscription: any;
    const obs = new Subject();
    const switchableObs = new SwitchableObservable(obs);
    const resultProm = new Promise<unknown>((resolve) => {
      subscription = switchableObs.subscribe({
        next: (value) => {
          resolve(value);
        },
        error: (err) => {
          throw err;
        },
        complete: () => {}
      });
    });

    // emit a value after subscribing
    obs.next('obs');
    const result = await resultProm;

    // make sure we get the correct result
    expect(result).toEqual('obs');
    subscription?.unsubscribe();
  });

  it('should emit the last value to a new consumer upon subscription', async () => {
    let subscription1, subscription2: any;

    // first consumer
    subscription1 = switchableObs.subscribe({
      next: (value) => {},
      error: (err) => {
        throw err;
      },
      complete: () => {}
    });

    // second consumer
    const resultProm = new Promise<unknown>((resolve) => {
      subscription2 = switchableObs.subscribe({
        next: (value) => {
          resolve(value);
        },
        error: (err) => {
          throw err;
        },
        complete: () => {}
      });
    });

    // emit a value after subscribing
    const result = await resultProm;

    // make sure we get the correct result
    expect(result).toEqual('obs1');
    subscription1.unsubscribe();
    subscription2.unsubscribe();
  });
});