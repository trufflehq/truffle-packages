import { useState, useLayoutEffect, useMemo } from 'https://npm.tfl.dev/haunted@5'

import useObservablesBase from "./use-observables-base.js"

export default (cb) => useObservablesBase(cb, { useState, useLayoutEffect, useMemo })