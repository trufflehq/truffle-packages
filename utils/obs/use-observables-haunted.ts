import {
  useLayoutEffect,
  useMemo,
  useState,
} from "https://tfl.dev/@truffle/distribute@^2.0.19/pinned-libs/haunted.ts";
import useObservablesBase from "./use-observables-base.ts";

export default (cb) =>
  useObservablesBase(cb, { useState, useLayoutEffect, useMemo });
