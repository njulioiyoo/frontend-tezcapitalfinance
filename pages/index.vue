<script setup>
import { useSwiper } from "#imports";

// Get homepage data with i18n support
const { locale, t } = useI18n()
const { 
  initHomepage, 
  sixReasons, 
  sixReasonsTitle,
  applicationProcess, 
  applicationProcessTitle,
  services,
  servicesTitle,
  partners,
  partnersTitle,
  news,
  newsTitle,
  faqItems,
  faqTitle,
  isLoading,
  error
} = useHomepage()

// Image fallback handler
const { handleImageError } = useImageFallback()

// Initialize homepage data
onMounted(async () => {
  // Small delay to ensure skeleton shows
  await new Promise(resolve => setTimeout(resolve, 100))
  await initHomepage()
})

// Watch for language changes and refetch data
watch(() => locale.value, () => {
  initHomepage()
}, { immediate: false })


const linkAnchor = computed(() => [
  {
    label: t('homepage.linkAnchor.whyChoose'),
    link: "#why-choose",
  },
  {
    label: t('homepage.linkAnchor.ourServices'),
    link: "#our-services",
  },
  {
    label: t('homepage.linkAnchor.applicationProcess'),
    link: "#application-process",
  },
  {
    label: t('homepage.linkAnchor.newsUpdates'),
    link: "#news-updates",
  },
  {
    label: t('homepage.linkAnchor.faq'),
    link: "#faq",
  },
]);

// Gallery data (keeping this as it's not part of homepage API)
const gallery = [
  {
    img: "/img/dummy3.jpg",
    alt: "Gallery 1",
  },
  {
    img: "/img/dummy2.jpg",
    alt: "Gallery 2",
  },
  {
    img: "/img/dummy1.jpg",
    alt: "Gallery 3",
  },
];

const navigateToService = (service) => {
  // Navigate to service detail page
  navigateTo(service.url || `/service/${service.id}`)
}

const scrollToSection = (id) => {
  const el = document.querySelector(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

const swiperBasicRef = ref(null);
const swiper1 = useSwiper(swiperBasicRef);
</script>
<template>
  <div>
    <!-- Loading State -->
    <HomePageSkeleton v-if="isLoading" />
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      :title="t('error.homepageLoadTitle')"
      :message="t('error.homepageLoadError')"
      @retry="initHomepage"
    />
    
    <!-- Content State -->
    <div v-else>
    <ClientOnly>
      <div class="relative">
        <swiper-container
          ref="swiperBasicRef"
          :loop="true"
          :pagination="{
            clickable: true,
          }"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }"
        >
          <swiper-slide
            v-for="slide in gallery"
            :key="`slide-basic-${slide.id}`"
            class="swiper-slide h-100 xl:h-200"
          >
            <img
              :src="slide.img"
              :alt="slide.alt"
              class="w-full h-full object-cover"
              @error="handleImageError($event, 'gallery')"
            />
          </swiper-slide>
        </swiper-container>
        <div
          class="flex items-center justify-between absolute top-1/2 left-1/2 -translate-1/2 z-10 w-[calc(100%_-_48px)]"
        >
          <button
            class="cursor-pointer size-8 xl:size-12 flex items-center justify-center bg-white rounded-full"
            @click="swiper1.prev()"
          >
            <Icon name="mdi:chevron-left" class="size-6 text-red-100" />
          </button>
          <button
            class="cursor-pointer size-8 xl:size-12 flex items-center justify-center bg-white rounded-full"
            @click="swiper1.next()"
          >
            <Icon
              name="mdi:chevron-right"
              class="size-4 xl:size-6 text-red-100"
            />
          </button>
        </div>
      </div>
    </ClientOnly>
    <div
      class="flex items-center justify-center flex-wrap gap-6 bg-red-100 px-3 xl:px-20 py-8 xl:py-12"
    >
      <div
        @click="scrollToSection(i.link)"
        class="rounded-full py-3 px-12 bg-white hover:bg-red-50 transition-all duration-300 cursor-pointer"
        v-for="(i, index) in linkAnchor"
        :key="index"
      >
        <p class="font-bold text-red-100 text-lg xl:text-2xl text-center">
          {{ i.label }}
        </p>
      </div>
    </div>
    <div class="flex flex-col gap-6 xl:gap-9 py-8 xl:py-12" id="why-choose">
      <h1 class="xl:text-5xl text-2xl text-black-100 font-bold text-center">
        {{ sixReasonsTitle || t('homepage.sections.sixReasons') }}
      </h1>
      <!-- Six Reasons from API -->
      <div v-if="sixReasons.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-3 xl:px-15">
        <div
          class="w-full max-w-100 mx-auto bg-black-50 rounded-2xl p-5 flex flex-col gap-5"
          v-for="(reason, index) in sixReasons"
          :key="reason.id"
        >
          <img
            :src="reason.icon"
            :alt="reason.title"
            class="w-full h-25 xl:h-50 object-contain"
            @error="handleImageError($event, 'reason')"
          />
          <div class="h-14 flex items-center justify-center">
            <p class="text-white text-center font-bold text-lg xl:text-xl">
              {{ reason.title }}
            </p>
          </div>
          <div class="bg-grey/30 p-4 rounded-xl h-32 flex items-center">
            <p class="text-center text-white text-sm xl:text-base">
              {{ reason.description }}
            </p>
          </div>
        </div>
      </div>
      <!-- No Data Alert -->
      <div v-else class="px-3 xl:px-15">
        <NoDataAlert section="Six Reasons" />
      </div>
    </div>
    <div class="py-8 xl:py-12">
      <div class="bg-divider h-0.25 w-full px-15"></div>
    </div>
    <div class="flex flex-col xl:gap-9 gap-6 py-8 xl:py-12" id="our-services">
      <h1 class="xl:text-5xl text-2xl text-black-100 font-bold text-center">
        {{ servicesTitle || t('homepage.sections.ourServices') }}
      </h1>
      <!-- Services from API -->
      <div v-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-15">
        <div
          v-for="(service, index) in services"
          :key="service.id"
          class="transition-all duration-300"
          @click="navigateToService(service)"
        >
          <div
            class="w-full max-w-100 mx-auto rounded-2xl p-3 flex flex-col gap-5 transition-all duration-300 select-none cursor-pointer bg-white hover:bg-red-50"
          >
            <img
              :src="service.featured_image"
              :alt="service.title"
              class="w-full h-25 xl:h-43 object-contain"
              @error="handleImageError($event, 'service')"
            />
            <div
              class="p-3 rounded-xl flex flex-col gap-2 items-center justify-center h-auto xl:h-35 bg-white/50"
            >
              <p
                class="text-red-100 text-center font-bold text-lg xl:text-xl"
              >
                {{ service.title }}
              </p>
              <p
                class="text-center text-sm xl:text-base text-red-100"
              >
                {{ service.excerpt }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- No Data Alert -->
      <div v-else class="px-15">
        <NoDataAlert section="Services" />
      </div>
      <NuxtLink
        to="/service"
        class="rounded-full mx-auto w-fit py-3 px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 transition-all duration-300 cursor-pointer font-bold text-white text-xl xl:text-2xl uppercase"
      >
        {{ t('homepage.goToService') }}
      </NuxtLink>
    </div>
    <div
      class="flex flex-col xl:gap-9 gap-6 py-8 xl:py-12 bg-grey"
      id="application-process"
    >
      <h1 class="xl:text-5xl text-2xl text-black-100 font-bold text-center">
        {{ applicationProcessTitle || t('homepage.sections.applicationProcess') }}
      </h1>
      <!-- Application Process from API -->
      <div v-if="applicationProcess.length > 0" class="grid grid-cols-1 xl:grid-cols-5 gap-12 px-3 xl:px-15 relative">
        <div
          class="flex flex-col gap-3 xl:gap-7 items-center"
          v-for="(process, index) in applicationProcess"
          :key="process.step"
        >
          <h3 class="font-bold text-red-100 text-lg xl:text-4xl text-center">
            Step {{ process.step }}
          </h3>
          <div
            class="xl:size-48 size-28 p-6 xl:p-10 bg-black-50 rounded-full flex items-center justify-center relative z-10"
          >
            <img
              :src="process.icon"
              :alt="process.description"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-center">{{ process.description }}</p>
        </div>
        <div
          class="absolute top-41 left-1/2 -translate-1/2 h-0.75 bg-red-100 w-[calc(100%_-_154px)] z-0 hidden xl:block"
        ></div>
      </div>
      <!-- No Data Alert -->
      <div v-else class="px-3 xl:px-15">
        <NoDataAlert section="Application Process" />
      </div>
      <NuxtLink
        to="#"
        class="rounded-full mx-auto w-fit py-3 px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 transition-all duration-300 cursor-pointer font-bold text-white text-xl xl:text-2xl uppercase"
      >
        {{ t('homepage.learnMore') }}
      </NuxtLink>
    </div>
    <!-- Our Partners Section - Hidden for now -->
    <!-- <div class="flex flex-col xl:gap-9 gap-6 py-8 xl:py-12">
      <h1 class="xl:text-5xl text-2xl text-black-100 font-bold text-center">
        {{ partnersTitle || t('homepage.sections.ourPartners') }}
      </h1>
      <div v-if="partners.length > 0" class="flex flex-wrap justify-center gap-6 px-3 xl:px-15">
        <div
          class="flex items-center justify-center"
          v-for="partner in partners"
          :key="partner.id"
        >
          <img
            :src="partner.logo"
            :alt="partner.name"
            class="object-contain w-37.5 h-37.5 xl:w-55 xl:h-25"
            @error="handleImageError($event, 'partner')"
          />
        </div>
      </div>
      <div v-else class="px-3 xl:px-15">
        <NoDataAlert section="Partners" />
      </div>
    </div> -->
    <div class="py-8 xl:py-12" id="news-updates">
      <div class="xl:px-15 px-3">
        <div
          class="flex justify-between items-end pb-5 mb-6 xl:mb-12 border-b border-b-divider"
        >
          <h1 class="xl:text-5xl text-2xl text-black-100 font-bold text-center">
            {{ newsTitle || t('homepage.newsUpdates') }}
          </h1>
          <NuxtLink
            class="text-red-100 flex items-center gap-1 h-fit"
            to="/news"
          >
            <span class="text text-base xl:text-xl">{{ t('homepage.seeAllNews') }}</span>
            <Icon name="mdi:chevron-right" class="text-divider size-5" />
          </NuxtLink>
        </div>
        <!-- News from API -->
        <ul v-if="news.length > 0" class="flex flex-col gap-4 xl:gap-5">
          <li v-for="article in news" :key="article.id">
            <NuxtLink
              :to="article.url"
              class="flex flex-col gap-1 pb-5 border-b border-b-divider"
            >
              <p class="text-divider text-sm xl:text-base">
                {{ new Date(article.published_at).toLocaleDateString() }} | {{ article.category }}
              </p>
              <h4 class="xl:text-4xl text-lg line-clamp-1 leading-12">{{ article.title }}</h4>
            </NuxtLink>
          </li>
        </ul>
        <!-- No Data Alert -->
        <div v-else>
          <NoDataAlert section="News" />
        </div>
      </div>
    </div>
    <div class="py-8 xl:py-12 px-3 xl:px-15" id="faq">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-12">
        <div class="grid grid-cols-2 xl:grid-cols-1 gap-3 items-center">
          <img
            src="/img/faq.png"
            alt="Frequently Asked Questions"
            class="xl:size-50 size-25 object-contain mx-auto"
            @error="handleImageError($event, 'faq')"
          />
          <h1 class="xl:text-5xl text-2xl font-bold">
            {{ faqTitle || t('homepage.frequentlyAskedQuestions') }}
          </h1>
        </div>
        <div class="flex flex-col gap-6 xl:gap-12 col-span-2">
          <!-- FAQ from API -->
          <Accordion v-if="faqItems.length > 0" type="single" class="w-full" collapsible>
            <AccordionItem
              v-for="item in faqItems"
              :key="item.id"
              :value="`item-${item.id}`"
            >
              <AccordionTrigger>{{ item.question }}</AccordionTrigger>
              <AccordionContent>
                {{ item.answer }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <!-- No Data Alert -->
          <div v-else>
            <NoDataAlert section="FAQ" />
          </div>
          <NuxtLink
            to="#"
            class="rounded-full w-fit mx-auto xl:mx-0 py-3 px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 transition-all duration-300 cursor-pointer font-bold text-white text-xl xl:text-2xl uppercase"
          >
            {{ t('homepage.learnMore') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
