import {
  useLayoutEffect,
  useMemo,
  useState,
} from "https://npm.tfl.dev/haunted@5/core";

import useObservablesBase from "./use-observables-base.ts";

export default (cb) =>
  useObservablesBase(cb, { useState, useLayoutEffect, useMemo });
