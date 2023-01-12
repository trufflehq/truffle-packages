<script setup lang="ts">
import EmbedController from './components/EmbedController.vue'
</script>

<template>
  <div>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="https://truffle.vip" target="_blank">
      <img src="https://cdn.bio/assets/images/branding/logomark.svg" class="logo truffle" alt="Truffle logo" />
    </a>
  </div>
  <h1>Vue + Truffle</h1>
  <EmbedController />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.logo.truffle:hover {
  filter: drop-shadow(0 0 2em #F357A1);
}
</style>
