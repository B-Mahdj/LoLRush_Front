<template>
  <div class="bg-[#0F172A] w-full py-10 h-screen overflow-y-auto">
    <div class="flex flex-col gap-5 justify-center items-center">
      <div
          class="transition-all ease-in-out delay-150 overflow-hidden duration-300 max-sm:w-11/12 sm:w-6/12 md:w-8/12 lg:w-4/12 xl:w-6/12 rounded shadow-md">
        <div class="bg-gray-800 w-full py-2 px-2">
          <p class="font-normal text-1.1em text-gray-100">Confirmation Code</p>
        </div>
        <div class="py-4 bg-[#0F172A90] px-2">
          <label class="md:flex lg:flex sm:block max-sm:block flex-row max-sm:space-y-5">
            <span class="flex-1">
              <input type="text" placeholder="Enter confirmation code" v-model="formData.confirm_code"
                     @change="validator$.confirm_code.$touch()"
                     :class="{'border-red-500 focus:border-red-500': validator$.confirm_code.$error, 'border-[#42d392] ': !validator$.confirm_code.$invalid}"
                     class="bg-opacity-20 w-full rounded border border-gray-700 bg-transparent text-white py-1 px-2 text-base font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-500 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent">
            <span v-for="error in validator$.confirm_code.$errors" :key="error.$uid"
                  class="text-red-600 text-sm font-light">{{ error.$message }}</span>
            </span>
            <span class="rounded rounded-l-none border-0 font-bold text-grey-100">
                    <button
                        @click="modalFormSubmitHandler"
                        class="bg-green-600 max-sm:w-full sm:w-full text-lg font-normal text-gray-300 py-2 px-6 rounded">Search</button>
                </span>
          </label>

        </div>
      </div>
      <transition name="fade">
        <div v-if="results.timeUntilEndChallenge"
             class="rounded overflow-hidden transition-all ease-in-out delay-150 duration-300 max-sm:w-11/12 sm:w-6/12 md:w-8/12 lg:w-4/12 xl:w-6/12">
          <div class="w-full">
            <div class="sm:-mx-8 px-4 sm:px-8">
              <div class="bg-green-700 text-white font-normal py-2 text-center uppercase">
                {{ results.timeUntilEndChallenge }}
              </div>
              <div class="inline-block min-w-full">
                <ul class="bg-gradient-to-br from-[#474747] to-[#0D0D0D] overflow-x-auto">
                  <li v-for="(player, index) in results.players_info" :key="index"
                      class="hover:bg-gradient-to-br  hover:from-[#7A7A7A] hover:to-[#252525]">
                    <div class="grid grid-cols-5 items-center">
                      <div class="pl-6 font-normal text-gray-300">{{ player.username }}</div>
                      <div class="pl-6 text-gray-300 flex items-center">
                        <img :src="`data:image/png;base64,${player.rank.icon}`" :alt="player.username" class="w-14">
                        <p class="font-normal">{{ player.rank.rank + " - " + player.rank.leaguePoints }}</p>
                      </div>
                      <div class="pl-6 font-normal text-gray-300">{{ player.rank.wins }}</div>
                      <div class="pl-6 font-normal text-gray-300">{{ player.losses + "L" }}</div>
                      <div class="pl-6 font-normal text-gray-300">{{ player.winrate + "% WR" }}</div>
                    </div>
                  </li>
                  <li>
                    <NuxtLink to="/" class="block w-full text-white py-2 text-center">Back</NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

</template>
<script setup lang="ts">
import Input from "~/components/Form/Input.vue";
import {helpers, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import axios from "axios";
import {useRouter} from "vue-router";

onMounted(function () {
  document.title = "Code Configuration Resources"
})
const formData = reactive({
  confirm_code: null
})
const rules = computed(() => {
  return {
    confirm_code: {
      required: helpers.withMessage("The confirm code is required", required)
    }
  }
})
const router = useRouter()
const ConfirmButtonTitle = ref("Confirm")
onMounted(() => {
  window.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
      router.replace("/");
    }
  })
})
const results = ref({})
const validator$ = useVuelidate(rules, formData)
const modalFormSubmitHandler = async () => {
  const result = await validator$.value.$validate()
  ConfirmButtonTitle.value = "Processing...."
  if (result) {
    //const confirmationCodeSubmitButton = document.querySelector("#confirmationCodeSubmitButton")
    await axios.get("https://lol-rush-back-gxqlr.ondigitalocean.app/page?code=" + formData.confirm_code).then(res => {
      if (res.status === 200) {
        results.value = res.data
      }
      ConfirmButtonTitle.value = "Confirm"
    }).catch(err => {
      if (err.code === "ECONNABORTED") {
        alert("The request timed out.");
      }
      ConfirmButtonTitle.value = "Confirm"
    })
  }
}


onUpdated(function () {
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
})
</script>