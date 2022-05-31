/**
 * One issue we can run into with multiple versions of different modules is multiple sets of state - one per version.
 * Think about when you accidentally have two React instances running at once - it doesn't work :p
 * To prevent that, we can have this global context that is always imported w/o a version. Anything that sets a global state
 * should use this
 *
 * This file needs to be simple / flexible enough that it basically never needs to be changed/versioned
 *
 * This is basically like throwing something in window[key], but with a little more structure.
 * Use sparingly
 */

class GlobalContext {
  set ({ key, value }) {

  }

  get ({ key }) {

  }
}

export default GlobalContext()
