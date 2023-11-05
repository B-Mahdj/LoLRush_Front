<script setup>
import {useError} from "#app";

const error = useError()
</script>

<template>
  <NuxtErrorBoundary>
    <div class="w-full justify-center items-center space-y-2 h-screen bg-[#0F172A] flex flex-col text-white">
      <h3 class="text-white">{{ error.statusMessage }}</h3>
      <p class="text-2xl">It looks like something broke.</p>
      <p>Sorry about that.</p>
      <NuxtLink to="/" class="py-2 px-8 rounded bg-green-600 inline-block">Back</NuxtLink>
    </div>
  </NuxtErrorBoundary>
</template>

<style scoped>
* {
  font-family: Roboto, serif;
  font-weight: bold;
}
</style>