<script>
import Link from "https://tfl.dev/@truffle/router@^1.0.0/components/link/link.tag.ts";

export default {
  data() {
    return {
      count: 0,
      Link
    }
  }
}
</script>

<template>
  <div>
    <button @click="count++">Count is: {{ count }}</button>
    <component :is="Link" href="/nested-example/some-param">
      <!-- wrapper element is needed for some reason for slotted content to work -->
      <!-- it isn't needed if the element tag name isn't dynamic, only needed for <component> -->
      <span>abcd</span>
    </component>
  </div>
</template>

<!-- doesn't work since it spits out in head and this is inside web component -->
<!-- we should be able to use our <Stylesheet ... /> -->
<style>
button {
  background: yellow;
  font-weight: bold;
}
</style>