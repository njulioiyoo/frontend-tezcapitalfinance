<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError } from "h3";
import type { NewsItem } from '~/types/api';

const { t, locale } = useI18n();
const apiStore = useApiStore();
const route = useRoute();

// Get slug from route params
const slug = route.params.slug as string;

// Reactive data
const isLoading = ref(true);
const error = ref<any>(null);
const newsItem = ref<NewsItem | null>(null);
const categories = ref<any>({});

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getLocalizedTitle = (item: NewsItem) => {
  return locale.value === 'en' && item.title_en ? item.title_en : item.title_id;
};

const getLocalizedContent = (item: NewsItem) => {
  return locale.value === 'en' && item.content_en ? item.content_en : item.content_id;
};

const getLocalizedExcerpt = (item: NewsItem) => {
  return locale.value === 'en' && item.excerpt_en ? item.excerpt_en : item.excerpt_id;
};

const getCategoryDisplayName = (category: string) => {
  return categories.value[category] || category;
};

// Fetch news detail
const fetchNewsDetail = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await apiStore.fetchNewsDetail(slug);
    newsItem.value = response.data || response; // Handle different response structures
    categories.value = response.categories || {}; // Extract categories mapping
    
    // Set page title
    const title = getLocalizedTitle(newsItem.value);
    useSeoMeta({
      title: title,
      description: getLocalizedExcerpt(newsItem.value),
      ogTitle: title,
      ogDescription: getLocalizedExcerpt(newsItem.value),
      ogImage: newsItem.value.featured_image_url || '/img/dummy1.jpg',
      twitterCard: 'summary_large_image',
    });
    
  } catch (err: any) {
    error.value = err;
    
    // If 404, throw a Nuxt error
    if (err.statusCode === 404 || err.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "News not found",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

// Share functions
const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareOnTwitter = () => {
  const text = newsItem.value ? getLocalizedTitle(newsItem.value) : '';
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareOnWhatsApp = () => {
  const text = newsItem.value ? `${getLocalizedTitle(newsItem.value)} - ${window.location.href}` : window.location.href;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    // You can add a toast notification here
    alert('Link copied to clipboard!');
  } catch (err) {
  }
};

const retryFetch = () => {
  fetchNewsDetail();
};

// Lifecycle
onMounted(() => {
  fetchNewsDetail();
});

// Watch for route changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== slug) {
    fetchNewsDetail();
  }
});
</script>

<template>
  <div>
    <Jumbotron
      :label="t('nav.newsEvent')"
      img="/img/dummy1.jpg"
      :desc="t('nav.news.jumbotronDesc')"
    />
    
    <!-- Loading State -->
    <div v-if="isLoading" class="xl:px-15 px-3 py-8 xl:py-12">
      <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
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
      :message="t('error.newsDetailLoadError')"
      @retry="retryFetch"
      class="xl:px-15 px-3 py-8 xl:py-12"
    />
    
    <!-- Content State -->
    <div v-else-if="newsItem" class="relative">
      <div class="xl:px-15 px-3 py-8 xl:py-12 relative">
        <NuxtLink
          to="/news"
          class="flex items-center gap-1 text-base text-red-100 mb-6 xl:hidden"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          {{ t('nav.news.backToNews') }}
        </NuxtLink>
        
        <p class="xl:text-xl text-base text-divider mb-1 xl:mb-6">
          {{ formatDate(newsItem.published_at) }} | {{ getCategoryDisplayName(newsItem.category) }}
        </p>
        
        <div class="flex flex-wrap gap-4 justify-between">
          <h1 class="xl:text-5xl text-2xl text-black-100">
            {{ getLocalizedTitle(newsItem) }}
          </h1>
          <div class="flex items-center gap-4">
            <Icon
              name="mdi:link-variant"
              class="text-black-50 size-4 xl:size-6 cursor-pointer hover:text-black-100"
              @click="copyLink"
              :title="t('nav.news.copyLink')"
            />
            <Icon 
              name="mdi:facebook" 
              class="text-black-50 size-4 xl:size-6 cursor-pointer hover:text-blue-600"
              @click="shareOnFacebook"
              :title="t('nav.news.shareOnFacebook')"
            />
            <Icon 
              name="mdi:twitter" 
              class="text-black-50 size-4 xl:size-6 cursor-pointer hover:text-blue-400"
              @click="shareOnTwitter"
              :title="t('nav.news.shareOnTwitter')"
            />
            <Icon 
              name="mdi:whatsapp" 
              class="text-black-50 size-4 xl:size-6 cursor-pointer hover:text-green-600"
              @click="shareOnWhatsApp"
              :title="t('nav.news.shareOnWhatsApp')"
            />
          </div>
        </div>
        
        <img
          :src="newsItem.featured_image_url || '/img/dummy1.jpg'"
          :alt="getLocalizedTitle(newsItem)"
          class="xl:h-125 h-75 w-full object-cover object-center my-6 xl:my-12"
          loading="lazy"
        />
        
        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div v-if="getLocalizedContent(newsItem)" v-html="getLocalizedContent(newsItem)" />
          <div v-else-if="getLocalizedExcerpt(newsItem)" v-html="getLocalizedExcerpt(newsItem)" />
          <p v-else class="text-gray-500">{{ t('nav.news.noContentAvailable') }}</p>
        </div>
        
        <!-- Event specific information -->
        <div v-if="newsItem.type === 'event'" class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-xl font-bold mb-4">{{ t('nav.news.eventDetails') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="newsItem.start_date">
              <span class="font-medium">{{ t('nav.news.startDate') }}:</span>
              {{ formatDate(newsItem.start_date) }}
            </div>
            <div v-if="newsItem.end_date">
              <span class="font-medium">{{ t('nav.news.endDate') }}:</span>
              {{ formatDate(newsItem.end_date) }}
            </div>
            <div v-if="newsItem.location_id || newsItem.location_en">
              <span class="font-medium">{{ t('nav.news.location') }}:</span>
              {{ locale === 'en' && newsItem.location_en ? newsItem.location_en : newsItem.location_id }}
            </div>
          </div>
        </div>
        
        <!-- Author and source -->
        <div v-if="newsItem.author || newsItem.source_url" class="mt-8 pt-6 border-t border-gray-200">
          <div v-if="newsItem.author" class="mb-2">
            <span class="font-medium">{{ t('nav.news.author') }}:</span> {{ newsItem.author }}
          </div>
          <div v-if="newsItem.source_url">
            <span class="font-medium">{{ t('nav.news.source') }}:</span>
            <a :href="newsItem.source_url" target="_blank" rel="noopener noreferrer" class="text-red-100 hover:underline">
              {{ newsItem.source_url }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Back button (desktop) -->
      <NuxtLink to="/news" class="hidden xl:block">
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