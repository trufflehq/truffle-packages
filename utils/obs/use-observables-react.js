import { useState, useLayoutEffect, useMemo } from 'https://npm.tfl.dev/react'

import useObservablesBase from "./use-observables-base.js"

export default (cb) => useObservablesBase(cb, { useState, useLayoutEffect, useMemo })