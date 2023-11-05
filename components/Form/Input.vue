<template>
  <div>
    <input
        @change="v$[field].$touch"
        placeholder="Enter your e-mail address."
        class="bg-opacity-20 w-full rounded border border-gray-300 bg-transparent py-1 px-3 text-base font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-500 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"
        :class="{
            'border-red-500 focus:border-red-500': v$[field].$error,
            'border-[#42d392] ': !v$[field].$invalid,
          }" label="Email"/>
    <span v-for="error in v$[field].$errors" :key="error.$uid" class="text-red-600 font-light">
      {{ error.$message }}
    </span>
  </div>
</template>
<script setup lang="ts">
const {field, v$} = defineProps({
  field: {
    required: true
  },
  v$: {
    required: true
  }
})
</script>