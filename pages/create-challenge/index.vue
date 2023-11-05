<script setup lang="ts">
import Input from "~/components/Form/Input.vue";
import {useVuelidate} from '@vuelidate/core';
import {required, email, helpers} from '@vuelidate/validators';
import RequiredField from '~/components/Required.vue'
import axios from "axios";
import {useRouter} from "vue-router";

const regionList = ['EUW1', 'NA1', 'BR1', 'EUN1', 'JP1', 'KR', 'LA1', 'LA2', 'OC1', 'TR1', 'RU', 'PH2', 'SG2', 'TH2', 'TW2', 'VN2'];
const errorMessage = ref("")
let formData = reactive({
  email: '',
  region: 'EUW1',
  player_1: '',
  player_2: '',
  player_3: '',
  player_4: '',
  player_5: '',
  player_6: '',
  player_7: '',
  player_8: '',
  daysUntilExpiration: null,
});

const allFieldsAreClear = () => {
  formData.player_1 = ""
  formData.player_2 = ""
  formData.player_3 = ""
  formData.player_4 = ""
  formData.player_5 = ""
  formData.player_6 = ""
  formData.player_7 = ""
  formData.player_8 = ""
  const fields = ["player_1", "player_2", "player_3", "player_4", "player_5", "player_6", "player_7", "player_8"]
  fields.forEach(field => {
    errorMessageHide(window.document.querySelector("." + field))
  })


}


const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('The email field is required', required),
      email: helpers.withMessage('Invalid email format', email),
    },
    region: {required: helpers.withMessage("The region field is required.", required)},
    player_1: {required: helpers.withMessage("The player 1 field is required.", required)},
    daysUntilExpiration: {required: helpers.withMessage("The number of days field is required.", required)},
  };
});


const v$ = useVuelidate(rules, formData);
const successMessage = ref({
  message: "",
  code: ""
})

const successModal = ref(false)

const modalToggle = () => {
  successModal.value = !successModal.value
}

let buttonTitle = ref("Submit")
onMounted(function () {
  document.title = "Challenge Form"
})
const handleSubmit = async () => {
  const result = await v$.value.$validate();
  if (result) {
    buttonTitle.value = "Loading..."
    await axios.post("https://lol-rush-back-gxqlr.ondigitalocean.app/create_temporary_page", formData).then(res => {
      if (res.status === 200) {
        successMessage.value.message = "Yeah! your challenge has been successfully create"
        successMessage.value.code = res.data
        modalToggle()
      }
      buttonTitle.value = "Submit"
    }).catch(err => {
      errorMessage.value = err.response.data.message
      buttonTitle.value = "Submit"
      document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
    })
  }
}


const errorMessageHide = (el) => {
  el.classList.add("hidden")
  el.classList.remove("block")
}

const checkUniqueValidation = (e) => {
  const name: String = e.target.name
  const value: String = e.target.value
  const element: Element = window.document.querySelector("." + name)
  axios.post("https://lol-rush-back-gxqlr.ondigitalocean.app/check_username", {
    player_username: value,
    region: formData.region
  }).then(response => {
    if (response.status === 404 && response.data.message !== "Bad Request, one or more of the required fields are missing") {
      element.classList.add("text-red-600")
      element.classList.remove("text-green-600")
    }
    if (response.status === 200) {
      element.classList.add("text-green-600")
      element.classList.remove("text-red-600")
    }
    if (response.data.message !== "Bad Request, one or more of the required fields are missing") {
      element.classList.remove('hidden')
    }
    element.innerHTML = response.data.message
  }).catch(err => {
    if (err.response.status === 404) {
      element.classList.add("text-red-600")
      element.classList.remove("text-green-600")
    }
    if (err.response.status === 200) {
      element.classList.add("text-green-600")
      element.classList.remove("text-red-600")
    }

    if (err.response.data.message !== "Bad Request, one or more of the required fields are missing") {
      element.classList.remove('hidden')
    }
    element.innerHTML = err.response.data.message
  })

  if (value === "") {
    errorMessageHide(element)
  }
}


const route = useRouter();
const copyCode = function (e: { target: { innerHTML: string; }; }) {
  navigator.clipboard.writeText(successMessage.value.code)
  route.replace("/")

}
</script>

<template>
  <div class="relative">
    <div class="absolute top-0 left-0 w-full">
      <div
          class="w-full h-full md:pr-5 bg-[#0F172A] md:pl-5 sm:px-5 lg:flex md:block md:justify-center xl:justify-center py-20 font-light">
        <div class="sm:w-full md:w-full lg:w-full xl:w-3/4 max-sm:mx-4 p-5 bg-[#1E293B] rounded shadow">
          <div class="border-b border-gray-600">
            <p class="text-2xl py-1 text-gray-200">Challenge Form</p>
            <p class="font-normal text-sm pb-3 text-gray-200">Use a permanent address where you can receive mail.</p>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-5 mt-8  text-gray-200" style="z-index: 999;">
            <div v-if="errorMessage"
                 class="w-full bg-red-200 space-y-1 px-3 rounded py-3 border-t-2 border-red-400">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>

            </div>
            <div class="max-sm:block  sm:block md:flex lg:flex gap-12 items-center">
              <label for="email" class="font-normal">Email Address
                <RequiredField/>
              </label>
              <div class="flex-1">
                <input
                    id="email"
                    v-model="formData.email"
                    @change="v$.email.$touch"
                    placeholder="Enter your e-mail address."
                    class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"
                    :class="{
            'border-red-500 focus:border-red-500': v$.email.$error,
            'border-[#42d392] ': !v$.email.$invalid,
          }" label="Email" field="input"/>
                <span v-for="error in v$.email.$errors" :key="error.$uid"
                      class="text-sm text-red-600 font-light">{{ error.$message }}</span>
              </div>
            </div>
            <div class="max-sm:block sm:block md:flex lg:flex gap-12 items-center">
              <label
                  class="font-normal"
                  for="region">Region
                <RequiredField/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <div class="flex-1">
                <select id="region" v-model="formData.region" @change="allFieldsAreClear"
                        class="w-full rounded border text-sm bg-gray-800 border-gray-600 py-2.5 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"
                        :class="{'border-red-500 focus:border-red-500': v$.region.$error,'border-[#42d392] ': !v$.region.$invalid}">
                  <option v-for="(region, index) in regionList" :key="region" :value="region"
                          class="font-light bg-gray-800">
                    {{ region }}
                  </option>
                </select>
                <span v-for="error in v$.region.$errors" :key="error.$uid"
                      class="text-sm text-red-600 font-light">{{ error.$message }}</span>
              </div>
            </div>
            <!-- Player-->
            <div class="max-sm:block  sm:block md:flex lg:flex items-center gap-12">
              <label for="player_1" class="text-sm font-normal">Player Username
                <RequiredField/>
              </label>
              <div class="flex-1">
                <input
                    id="player_1"
                    name="player_1"
                    v-model="formData.player_1"
                    @change="v$.player_1.$touch()"
                    @keyup="checkUniqueValidation"
                    placeholder="Enter player 1 username"
                    class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"
                    :class="{
                    'border-red-500 focus:border-red-500': v$.player_1.$error,
                    'border-[#42d392] ': !v$.player_1.$invalid,
                  }" label="Player 1"/>
                <span v-for="error in v$.player_1.$errors" :key="error.$uid"
                      class="text-sm text-red-600 font-light">{{ error.$message }}</span>
                <span
                    class="player_1 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_2" class="text-sm font-normal">Player Username</label>
              <div class="flex-1">
                <input id="player_2" name="player_2" v-model="formData.player_2" @keyup="checkUniqueValidation"
                       placeholder="Enter player 2 username"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_2 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_3" class="text-sm font-normal">Player Username
              </label>
              <div class="flex-1">
                <input id="player_3" name="player_3" v-model="formData.player_3" placeholder="Enter player 3 username"
                       @keyup="checkUniqueValidation"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_3 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_4" class="text-sm font-normal">Player Username</label>
              <div class="flex-1">
                <input id="player_4" name="player_4" v-model="formData.player_4" placeholder="Enter player 4 username"
                       @keyup="checkUniqueValidation"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_4 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_5" class="text-sm font-normal">Player Username
              </label>
              <div class="flex-1">
                <input id="player_5" name="player_5" v-model="formData.player_5" placeholder="Enter player 5 username"
                       @keyup="checkUniqueValidation"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_5 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_6" class="text-sm font-normal">Player Username
              </label>
              <div class="flex-1">
                <input id="player_6" name="player_6" v-model="formData.player_6" placeholder="Enter player 6 username"
                       @keyup="checkUniqueValidation"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_6 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_7" class="text-sm font-normal">Player Username</label>
              <div class="flex-1">
                <input id="player_7" name="player_7" v-model="formData.player_7" placeholder="Enter player 7 username"
                       @keyup="checkUniqueValidation"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_7 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <!-- Player-->
            <div class="max-sm:block sm:block md:flex lg:flex items-center gap-14">
              <label for="player_8" class="text-sm font-normal">Player Username</label>
              <div class="flex-1">
                <input id="player_8" name="player_8" v-model="formData.player_8" placeholder="Enter player 8 username"
                       @keyup="checkUniqueValidation"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"/>
                <span
                    class="player_8 text-sm font-normal hidden"></span>
              </div>
            </div>
            <!-- / Player-->
            <div class="max-sm:block sm:block md:flex lg:flex gap-10 items-center">
              <label for="number_of_days" class="font-normal">Number of days
                <RequiredField/>
              </label>
              <div class="flex-1">
                <input id="number_of_days" type="number" v-model="formData.daysUntilExpiration"
                       @change="v$.daysUntilExpiration.$touch"
                       placeholder="Number of days of the challenge (1 - 14 days)"
                       class="bg-opacity-20 w-full rounded border text-sm border-gray-600 bg-transparent py-1 px-3 font-normal leading-8 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-300 focus:border-blue-500 focus:bg-transparent focus:ring-2 ring-transparent focus:ring-transparent"
                       :class="{
            'border-red-500 focus:border-red-500': v$.daysUntilExpiration.$error, 'border-[#42d392] ': !v$.daysUntilExpiration.$invalid}"
                       label="Player 1"/>
                <span v-for="error in v$.daysUntilExpiration.$errors" :key="error.$uid"
                      class="text-sm text-red-600 font-light">
                  {{ error.$message }}
                </span>
              </div>
            </div>
            <div class="max-sm:text-center text-end font-normal">
              <NuxtLink to="/"
                        class="inline-block font-normal max-sm:py-2 max-sm:px-5 sm:px-7 py-2 bg-gray-400 mr-3 text-white rounded mt-3 px-8">
                Cancel
              </NuxtLink>
              <button type="submit"
                      class="max-sm:py-2 max-sm:px-5 sm:px-7 py-2 font-normal bg-green-500 text-white rounded mt-3 px-8">
                {{ buttonTitle }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <transition name="fade" appear>
        <div v-if="successModal"
             class="bg-[#ffffff95] transition-all ease-in-out delay-150 duration-300 backdrop-blur-sm fixed top-0 left-0 w-full h-full">
          <div class="flex justify-center items-center h-full">
            <form
                class="max-sm:w-10/12 transition-all ease-in-out delay-150 duration-300 sm:w-6/12 md:w-6/12 lg:w-4/12 xl:w-4/12 bg-white rounded py-2 shadow-md px-5 space-y-5">
              <p class="text-2xl text-green-700">Success</p>
              <hr>
              <p class="text-sm text-green-700 mb-0 pb-0">{{ successMessage.message }}</p>
              <p class="capitalize cursor-pointer text-green-600 m-0 pt-0">Your confirmation Code Is: <span
                  @click="copyCode" id="code">{{ successMessage.code }}</span></p>
              <div class="flex justify-end gap-4">
                <button type="submit" id="confirmation_code_submit_button" @click="copyCode"
                        class="bg-green-600 hover:bg-green-700 transition py-2 rounded px-6 text-white inline-block">
                  Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
</style>