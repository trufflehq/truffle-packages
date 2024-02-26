<script setup lang="ts">
import { getEmbed } from '@trufflehq/sdk';
import { reactive } from 'vue';

const embed = getEmbed();

const state = reactive({
  hasBorder: false,
  isSmall: true,
});

const toggleBorder = () => {
  if (state.hasBorder) {
    embed.setStyles({
      border: 'none',
    });
    state.hasBorder = false;
  } else {
    embed.setStyles({
      border: '5px solid red',
    });
    state.hasBorder = true;
  }
};

const toggleSize = () => {
  if (state.isSmall) {
    embed.setStyles({
      width: '800px',
      height: '800px',
    });
    state.isSmall = false;
  } else {
    embed.setStyles({
      width: '600px',
      height: '600px',
    });
    state.isSmall = true;
  }
};
</script>

<template>
  <div>
    <h2>Embed controls</h2>
    <button @click="toggleBorder">Toggle border</button>
    <button @click="toggleSize">Toggle size</button>
  </div>
</template>
