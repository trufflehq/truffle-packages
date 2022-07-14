<script>
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";

export default {
  data() {
    return {
      params: useParams()
    }
  }
}
</script>

<template>
  Params: {{ params }}
</template>

<style>
button {
  font-weight: bold;
}
</style>