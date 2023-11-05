<template>
  <main>
    <HeroComponent @modalOpen="modalIsOpen"/>
    <FooterSection/>
  </main>
</template>
<script setup>
import HeroComponent from "../components/HomeComponent.vue"
import FooterSection from "../components/FooterSection.vue"


onMounted(function () {
  document.title = "Home Page"
})

const modelOpen = ref(false)
const modalIsOpenAnimation = ref("bounce")
const modalIsOpen = () => {
  modelOpen.value = !modelOpen.value
  modalIsOpenAnimation.value = modelOpen.value ? "bounce" : "fade"
}


</script>
<style>
* {
  font-family: Roboto, serif;
  font-weight: bold;
}


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

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
