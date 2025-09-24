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

const getLocalizedRequirements = (item: ServiceItem) => {
  return locale.value === 'en' && item.requirements_en ? item.requirements_en : item.requirements_id;
};

const getLocalizedBenefits = (item: ServiceItem) => {
  return locale.value === 'en' && item.benefits_en ? item.benefits_en : item.benefits_id;
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

// Dynamic accordion items based on service data
const accordionItems = computed(() => {
  if (!serviceItem.value) return [];
  
  const items = [];
  
  // Interest & Fees section
  if (serviceItem.value.interest_list_array?.length || serviceItem.value.interest_rate || serviceItem.value.service_duration) {
    let content = '<div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300">';
    content += '<thead><tr class="bg-gray-100"><th class="border border-gray-300 px-4 py-2 text-left font-semibold">Item</th><th class="border border-gray-300 px-4 py-2 text-left font-semibold">Detail</th></tr></thead>';
    content += '<tbody>';
    
    if (serviceItem.value.interest_rate) {
      content += `<tr><td class="border border-gray-300 px-4 py-2 font-medium">Interest Rate</td><td class="border border-gray-300 px-4 py-2">${serviceItem.value.interest_rate}%</td></tr>`;
    }
    
    if (serviceItem.value.service_duration) {
      content += `<tr><td class="border border-gray-300 px-4 py-2 font-medium">Service Duration</td><td class="border border-gray-300 px-4 py-2">${serviceItem.value.service_duration}</td></tr>`;
    }
    
    if (serviceItem.value.interest_list_array?.length) {
      serviceItem.value.interest_list_array.forEach((item, index) => {
        const parts = item.split(':');
        const label = parts[0]?.trim() || `Item ${index + 1}`;
        const value = parts[1]?.trim() || item;
        content += `<tr><td class="border border-gray-300 px-4 py-2 font-medium">${label}</td><td class="border border-gray-300 px-4 py-2">${value}</td></tr>`;
      });
    }
    
    content += '</tbody></table></div>';
    
    items.push({
      value: "interest-fees",
      title: "Interest & Fees",
      content: content
    });
  }
  
  // Document List section
  if (serviceItem.value.document_list_array?.length) {
    let content = '<div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300">';
    content += '<thead><tr class="bg-gray-100"><th class="border border-gray-300 px-4 py-2 text-left font-semibold">No</th><th class="border border-gray-300 px-4 py-2 text-left font-semibold">Document Required</th></tr></thead>';
    content += '<tbody>';
    
    serviceItem.value.document_list_array.forEach((doc, index) => {
      content += `<tr><td class="border border-gray-300 px-4 py-2 text-center font-medium">${index + 1}</td><td class="border border-gray-300 px-4 py-2">${doc}</td></tr>`;
    });
    
    content += '</tbody></table></div>';
    
    items.push({
      value: "document-list",
      title: "Document List",
      content: content
    });
  }
  
  return items;
});

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
        <h1 class="xl:text-5xl text-2xl font-bold mb-6 text-center">
        {{ getLocalizedTitle(serviceItem) }}
      </h1>
      <div class="prose prose-lg max-w-none">
        <div v-if="getLocalizedContent(serviceItem)" v-html="getLocalizedContent(serviceItem)" />
        <div v-else-if="getLocalizedExcerpt(serviceItem)" v-html="getLocalizedExcerpt(serviceItem)" />
        <p v-else class="text-gray-500">No description available</p>
      </div>
        
        <!-- Service Details -->
        <div v-if="accordionItems.length" class="mt-12">
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
                <div v-html="item.content"></div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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