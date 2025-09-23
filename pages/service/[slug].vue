<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError } from "h3";
import type { ServiceItem } from '~/types/api';

const { t, locale } = useI18n();
const apiStore = useApiStore();
const route = useRoute();

// Get slug from route params
const slug = route.params.slug as string;

// Reactive data
const isLoading = ref(true);
const error = ref<any>(null);
const serviceItem = ref<ServiceItem | null>(null);

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getLocalizedTitle = (item: ServiceItem) => {
  return locale.value === 'en' && item.title_en ? item.title_en : item.title_id;
};

const getLocalizedContent = (item: ServiceItem) => {
  return locale.value === 'en' && item.content_en ? item.content_en : item.content_id;
};

const getLocalizedExcerpt = (item: ServiceItem) => {
  return locale.value === 'en' && item.excerpt_en ? item.excerpt_en : item.excerpt_id;
};

// Fetch service detail
const fetchServiceDetail = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await apiStore.fetchServiceDetail(slug);
    serviceItem.value = response.data || response; // Handle different response structures
    
    // Set page title
    const title = getLocalizedTitle(serviceItem.value);
    useSeoMeta({
      title: title,
      description: getLocalizedExcerpt(serviceItem.value),
      ogTitle: title,
      ogDescription: getLocalizedExcerpt(serviceItem.value),
      ogImage: serviceItem.value.featured_image_url || '/img/services/1.png',
      twitterCard: 'summary_large_image',
    });
    
  } catch (err: any) {
    error.value = err;
    
    // If 404, throw a Nuxt error
    if (err.statusCode === 404 || err.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Service not found",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const retryFetch = () => {
  fetchServiceDetail();
};

// Lifecycle
onMounted(() => {
  fetchServiceDetail();
});

// Watch for route changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== slug) {
    fetchServiceDetail();
  }
});

// Dummy data for features (can be moved to API later)
const accordionItems = [
  {
    value: "item-1",
    title: "Interest & Fees",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
  },
  {
    value: "item-2", 
    title: "Document List",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
  },
];

const creditSimulation = [
  {
    img: "/img/credit/1.png",
    label: "Ponsel",
  },
  {
    img: "/img/credit/2.png",
    label: "Laptop",
  },
  {
    img: "/img/credit/3.png",
    label: "Motor",
  },
  {
    img: "/img/credit/4.png",
    label: "Mobil",
  },
  {
    img: "/img/credit/5.png",
    label: "Alat Musik",
  },
];
</script>

<template>
  <div>
    <Jumbotron
      label="Services"
      img="/img/dummy1.jpg"
      desc="Temukan layanan terbaik untuk kebutuhan finansial Anda"
    />
    
    <!-- Loading State -->
    <div v-if="isLoading" class="xl:px-15 px-3 py-8 xl:py-12">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div class="h-64 bg-gray-200 rounded mb-6"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      :title="t('error.loadDataFailed')"
      :message="t('error.serviceDetailLoadError')"
      @retry="retryFetch"
      class="xl:px-15 px-3 py-8 xl:py-12"
    />
    
    <!-- Content State -->
    <div v-else-if="serviceItem" class="relative">
      <div class="xl:px-15 px-3 py-8 xl:py-12 relative">
        <NuxtLink
          to="/service"
          class="flex items-center gap-1 text-base text-red-100 mb-6 xl:hidden"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          Back to Services
        </NuxtLink>
        
        <div class="flex flex-col xl:flex-row gap-6 items-center xl:items-start">
          <img
            :src="serviceItem.featured_image_url || '/img/services/1.png'"
            :alt="getLocalizedTitle(serviceItem)"
            class="xl:size-150 size-75 object-cover rounded-lg"
            loading="lazy"
          />
          <div class="flex flex-col gap-4 xl:gap-6 text-center xl:text-left">
            <h1 class="xl:text-5xl text-2xl text-black-100 font-bold">
              {{ getLocalizedTitle(serviceItem) }}
            </h1>
            <div class="prose prose-lg max-w-none">
              <div v-if="getLocalizedContent(serviceItem)" v-html="getLocalizedContent(serviceItem)" />
              <div v-else-if="getLocalizedExcerpt(serviceItem)" v-html="getLocalizedExcerpt(serviceItem)" />
              <p v-else class="text-gray-500">No description available</p>
            </div>
          </div>
        </div>
        
        <!-- Service Details -->
        <div class="mt-12">
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem
              v-for="item in accordionItems"
              :key="item.value"
              :value="item.value"
            >
              <AccordionTrigger class="xl:text-2xl text-lg">{{
                item.title
              }}</AccordionTrigger>
              <AccordionContent class="xl:text-xl text-base">
                {{ item.content }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <!-- Credit Simulation -->
        <div class="mt-12">
          <h2 class="xl:text-5xl text-2xl text-black-100 mb-6 xl:mb-9 text-center xl:text-left">
            Credit Simulation
          </h2>
          <div class="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <div
              v-for="item in creditSimulation"
              :key="item.label"
              class="flex flex-col items-center gap-2 xl:gap-4 cursor-pointer hover:opacity-80"
            >
              <img
                :src="item.img"
                :alt="item.label"
                class="xl:size-25 size-20 object-cover"
                loading="lazy"
              />
              <p class="text-center text-sm xl:text-base">{{ item.label }}</p>
            </div>
          </div>
        </div>
        
        <!-- Service meta information -->
        <div v-if="serviceItem.author || serviceItem.source_url" class="mt-8 pt-6 border-t border-gray-200">
          <div v-if="serviceItem.author" class="mb-2">
            <span class="font-medium">Author:</span> {{ serviceItem.author }}
          </div>
          <div v-if="serviceItem.source_url">
            <span class="font-medium">Source:</span>
            <a :href="serviceItem.source_url" target="_blank" rel="noopener noreferrer" class="text-red-100 hover:underline">
              {{ serviceItem.source_url }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Back button (desktop) -->
      <NuxtLink to="/service" class="hidden xl:block">
        <Icon name="mdi:chevron-left" class="size-8 absolute top-12 left-0 hover:text-red-100" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: inherit;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: inherit;
}

.prose a {
  color: #dc2626;
  text-decoration: none;
}

.prose a:hover {
  text-decoration: underline;
}
</style>