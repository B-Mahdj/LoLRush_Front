<script setup>
import HeroImage from "~/public/home-page-img.webp";
import BackgroundSvg from "~/components/BackgroundSvg.vue";
</script>

<template>
  <div class="w-full h-full max-sm:block bg-[#0F172A] sm:block md:block lg:flex align-items-center">
    <div class="sm:block lg:grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 py-20 px-2 z-99"
         style="z-index: 1;">
      <div class="flex max-sm:py-10 md:py-20 sm:py-20 md:px-4 items-center text-center">
        <div class="px-3 space-y-5 text-green-500">
          <h1 class="max-sm:text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-7">Unleash the Ultimate LoL Gaming
            Challenge</h1>
          <p class="max-sm:text-sm max-md:text-lg mb-3 text-2xl max-sm:py-1 py-3 font-bold">Create League of Legends
            challenges <br>and track YOUR friends' ranks</p>
          <div class="space-x-3 max-sm:space-y-3">
            <NuxtLink to="create-challenge"
                      class="py-2 max-sm:text-sm font-normal px-5 hover:bg-green-600 inline-block shadow-md transition bg-green-500 rounded text-gray-900">
              Create Challenge
            </NuxtLink>
            <NuxtLink to="/result"
                      class="py-2 max-sm:text-sm font-normal px-5 hover:bg-gray-800 inline-block shadow-md transition bg-transparent border border-gray-700 rounded text-white">
              Enter Code
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="p-2 flex justify-center items-center">
        <img :src="HeroImage" alt="Hero Image" class="w-full shadow-md bg-cover rounded">
      </div>
    </div>
    <div>
      <BackgroundSvg/>
    </div>
  </div>
</template>

<style scoped>

</style>
