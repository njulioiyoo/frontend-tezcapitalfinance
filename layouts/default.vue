<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";

const { applyNowLink, contactPhone, buttonJoinUsEnabled, initConfiguration } = useConfiguration();
const showBackToTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 800;
};

onMounted(async () => {
  // Initialize configuration
  await initConfiguration();
  
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <main class="max-w-[1440px] mx-auto relative">
    <Header />
    <div class="mt-16 xl:mt-28.5">
      <slot />
    </div>
    <Footer class="mb-12 xl:mb-0" />
    <div
      class="flex items-center justify-between gap-3 py-3 px-3 sm:px-4 md:px-6 bg-white fixed bottom-0 w-full z-10 xl:hidden border-t border-t-grey"
    >
      <a class="flex items-center gap-2" :href="`tel:+${contactPhone?.replace(/[^0-9]/g, '') || '2150666206'}`">
        <div
          class="size-6 bg-divider items-center justify-center rounded-full p-1 hidden md:flex"
        >
          <Icon name="mdi:phone" class="text-white" />
        </div>
        <span class="text-sm xl:text-xl font-medium">{{ contactPhone || '021-5066-6206' }}</span>
      </a>
      <div class="flex items-center gap-3">
        <a
          :href="applyNowLink || '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="py-1 px-6 rounded-full bg-red-100 hover:bg-red-50 transition-all duration-300 font-bold text-sm xl:text-xl text-white hover:text-red-100 flex items-center justify-center cursor-pointer"
        >
          {{ $t('nav.applyNow') }}
        </a>
        <NuxtLink
          v-if="buttonJoinUsEnabled"
          to="/join-us"
          class="py-1 px-6 rounded-full bg-white hover:bg-red-100 transition-all duration-300 font-medium text-sm xl:text-xl text-red-100 hover:text-white flex items-center justify-center cursor-pointer border border-red-100"
        >
          {{ $t('nav.joinUs') }}
        </NuxtLink>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-500"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-500"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed z-10 size-10 xl:size-12 flex items-center group justify-center bg-red-100 hover:bg-red-50 rounded-full bottom-16 xl:bottom-6 right-6 cursor-pointer transition-all duration-300"
      >
        <Icon
          name="mdi:arrow-up-thin"
          class="text-white group-hover:text-red-100 size-7 xl:size-8 transition-all duration-300"
        />
      </div>
    </Transition>
  </main>
</template>
