<script setup lang="ts">
import { getLocalTimeZone, today } from "@internationalized/date"
import { ref, computed, watch, onMounted, nextTick } from "vue"
import type { NewsResponse, NewsItem } from '~/types/api'

const { t, locale } = useI18n()
const apiStore = useApiStore()

// Banner data
const bannerData = ref({})

// Calendar state
const selectedDate = ref(null)
const dateRange = ref({ start: null, end: null })
const filterMode = ref('single') // 'single' or 'range'

// Loading and error state
const isLoading = ref(true)
const error = ref<any>(null)

// News data
const newsResponse = ref<NewsResponse | null>(null)
const highlightedNews = ref<NewsItem[]>([])

// Filter state
const currentCategory = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)

// Reactive data - test with hardcoded categories first
const categories = ref({})

// Function to update categories with i18n
const updateCategories = () => {
  console.log('🔄 updateCategories called, locale:', locale.value)
  
  // Test with hardcoded categories to verify i18n works
  const testCategories = {
    'all': t('nav.news.allNews'),
    'business': t('nav.news.bisnis'),
    'company-activities': t('nav.news.companyActivities'),
    'press-release': t('nav.news.pressRelease'),
    'highlights': t('nav.news.highlights')
  }
  
  console.log('🧪 Test categories with i18n:', testCategories)
  categories.value = testCategories
  
  // Keep the original API-based logic for debugging
  if (newsResponse.value && newsResponse.value.categories) {
    console.log('📊 newsResponse.categories:', newsResponse.value.categories)
    
    // Map API categories to i18n keys
    const mappedCategories = {}
    Object.keys(newsResponse.value.categories).forEach(key => {
      console.log(`🗂️ Processing category: ${key}`)
      switch(key) {
        case 'business':
          mappedCategories[key] = t('nav.news.bisnis')
          console.log(`  ✅ business -> ${mappedCategories[key]}`)
          break
        case 'company-activities':
          mappedCategories[key] = t('nav.news.companyActivities')
          console.log(`  ✅ company-activities -> ${mappedCategories[key]}`)
          break
        case 'press-release':
          mappedCategories[key] = t('nav.news.pressRelease')
          console.log(`  ✅ press-release -> ${mappedCategories[key]}`)
          break
        case 'highlights':
          mappedCategories[key] = t('nav.news.highlights')
          console.log(`  ✅ highlights -> ${mappedCategories[key]}`)
          break
        default:
          mappedCategories[key] = newsResponse.value.categories[key]
          console.log(`  ⚠️ default case: ${key} -> ${mappedCategories[key]}`)
      }
    })
    
    const apiBasedCategories = { 
      'all': t('nav.news.allNews'),
      ...mappedCategories
    }
    
    console.log('🔄 API-based categories:', apiBasedCategories)
    // Comment out to use hardcoded for now: categories.value = apiBasedCategories
  }
  
  console.log('✅ Final categories (hardcoded test):', categories.value)
}

const featuredNews = computed(() => {
  return newsResponse.value?.data?.data?.filter(item => item.is_featured) || []
})

const currentNews = computed(() => {
  return newsResponse.value?.data?.data || []
})

const pagination = computed(() => {
  return newsResponse.value?.data || null
})

const searchResultText = computed(() => {
  if (!newsResponse.value) return ''
  const total = newsResponse.value.data.total
  if (searchQuery.value) {
    return `${total} ${t('nav.news.resultsFoundWith')} "${searchQuery.value}"`
  }
  return `${total} ${t('nav.news.articlesFound')}`
})

const showSearchResults = computed(() => {
  return searchQuery.value || currentCategory.value !== 'all' || selectedDate.value || (dateRange.value.start && dateRange.value.end)
})

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getLocalizedTitle = (item: NewsItem) => {
  return locale.value === 'en' && item.title_en ? item.title_en : item.title_id
}

const getLocalizedCategory = (categoryKey: string) => {
  return categories.value[categoryKey] || categoryKey
}

// API functions
const fetchNews = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const params: any = {
      page: currentPage.value,
      limit: 5
    }
    
    if (currentCategory.value && currentCategory.value !== 'all') {
      params.category = currentCategory.value
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    // Add date filtering
    if (selectedDate.value) {
      params.date = selectedDate.value.toString()
    }
    
    if (dateRange.value.start && dateRange.value.end) {
      params.date_from = dateRange.value.start.toString()
      params.date_to = dateRange.value.end.toString()
    }
    
    const response = await apiStore.fetchNews(params)
    newsResponse.value = response
    
    // Update categories with i18n
    updateCategories()
    
    // Get featured news for highlights if we're on the first page and no filters
    if (currentPage.value === 1 && !searchQuery.value) {
      const featuredResponse = await apiStore.fetchNews({ featured: true, limit: 5 })
      highlightedNews.value = featuredResponse.data.data
    }
    
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => {
  fetchNews()
}

// Event handlers
const handleCategoryChange = (category: string) => {
  currentCategory.value = category
  currentPage.value = 1
  fetchNews()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchNews()
}

const handleDateFilter = (date) => {
  selectedDate.value = date
  currentPage.value = 1
  fetchNews()
}

const clearDateFilter = () => {
  selectedDate.value = null
  dateRange.value = { start: null, end: null }
  currentPage.value = 1
  fetchNews()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchNews()
}

// Hash navigation mapping
const hashToCategoryMap = {
  'bisnis': 'business',
  'company-activities': 'company-activities', 
  'press-release': 'press-release',
  'highlights': 'highlights'
}

// Handle hash navigation
const handleHashNavigation = () => {
  if (process.client && window.location.hash) {
    const hash = window.location.hash.slice(1) // Remove #
    if (hashToCategoryMap[hash]) {
      currentCategory.value = hashToCategoryMap[hash]
      fetchNews()
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchBannerData()
  fetchNews()
  
  // Handle hash navigation on page load
  nextTick(() => {
    handleHashNavigation()
  })
})

// Fetch banner data using cache
const fetchBannerData = async () => {
  try {
    const { getBannerConfig } = useConfigurationCache()
    bannerData.value = await getBannerConfig()
  } catch (err) {
    // Silent error handling for banner data
  }
}

// Helper function to extract value from configuration object
const extractConfigValue = (configObj: any) => {
  if (!configObj) return ''
  if (typeof configObj === 'string') return configObj
  if (configObj.value !== undefined) return configObj.value
  return ''
}

// Computed banner properties
const bannerTitle = computed(() => {
  const titleField = locale.value === 'id' 
    ? bannerData.value.banner_news_title_id 
    : bannerData.value.banner_news_title_en
  
  const defaultTitle = t('nav.newsEvent')
  return extractConfigValue(titleField) || defaultTitle
})

const bannerDescription = computed(() => {
  const descField = locale.value === 'id' 
    ? bannerData.value.banner_news_description_id 
    : bannerData.value.banner_news_description_en
  
  const defaultDesc = t('nav.news.jumbotronDesc')
  return extractConfigValue(descField) || defaultDesc
})

const bannerImage = computed(() => {
  return extractConfigValue(bannerData.value.banner_news_image) || 'img/dummy1.jpg'
})

// Watch for language changes
watch(() => locale.value, () => {
  fetchBannerData()
  updateCategories()
  fetchNews()
}, { immediate: false })

// Watch search query with debounce
const debouncedSearch = ref('')
watch(() => searchQuery.value, (newValue) => {
  clearTimeout(debouncedSearch.value)
  debouncedSearch.value = setTimeout(() => {
    handleSearch()
  }, 500)
})

// Watch for route changes to handle hash navigation
const route = useRoute()
watch(() => route.hash, (newHash) => {
  if (newHash && process.client) {
    nextTick(() => {
      handleHashNavigation()
    })
  }
}, { immediate: true })
</script>

<template>
  <div>
    <Jumbotron
      :label="bannerTitle"
      :img="bannerImage"
      :desc="bannerDescription"
    />
    
    <!-- Loading State -->
    <NewsPageSkeleton v-if="isLoading" />
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      :title="t('error.loadDataFailed')"
      :message="t('error.newsPageLoadError')"
      @retry="retryFetch"
    />
    
    <!-- Content State -->
    <div v-else>
      <!-- Highlights Section -->
      <div class="px-3 xl:px-15 py-8 xl:py-12" v-if="highlightedNews.length" id="highlights">
        <h1 class="text-black-100 font-bold xl:text-5xl text-2xl mb-6 xl:mb-9">
          {{ t('nav.news.highlights') }}
        </h1>
        <ClientOnly>
          <swiper-container
            :loop="true"
            :space-between="48"
            :pagination="{
              clickable: true,
            }"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            class="overflow-visible"
          >
            <swiper-slide
              v-for="item in highlightedNews"
              :key="`slide-${item.id}`"
              class="swiper-slide pb-12"
            >
              <NuxtLink :to="`/news/${item.slug}`">
                <div class="shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
                  <img
                    :src="item.featured_image_url || '/img/dummy1.jpg'"
                    :alt="getLocalizedTitle(item)"
                    class="w-full h-75 object-cover"
                  />
                  <div class="gap-6 p-4 xl:p-6">
                    <p class="text-sm xl:text-xl text-divider mb-1 xl:mb-3">
                      {{ formatDate(item.published_at) }} | {{ getLocalizedCategory(item.category) }}
                    </p>
                    <div class="flex justify-between items-center gap-3">
                      <p class="xl:text-5xl text-xl text-black-100 line-clamp-1">
                        {{ getLocalizedTitle(item) }}
                      </p>
                      <div class="flex items-center gap-2">
                        <p class="text-red-100 text-sm xl:text-xl">{{ t('nav.news.readArticle') }}</p>
                        <Icon name="mdi:chevron-right" class="xl:size-5 size-4 text-red-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>

      <!-- Main Content Section -->
      <div class="px-3 xl:px-15 pb-8 xl:pb-12">
        <Tabs :model-value="currentCategory" class="w-full mt-3 xl:mt-12">
          <TabsList>
            <TabsTrigger
              v-for="(label, key) in categories"
              :key="key"
              :value="key"
              :id="Object.keys(hashToCategoryMap).find(hash => hashToCategoryMap[hash] === key) || key"
              @click="handleCategoryChange(key)"
            >
              {{ label }}
            </TabsTrigger>
          </TabsList>
          
          <div class="flex justify-between flex-col lg:flex-row mt-5 gap-6">
            <div class="flex flex-col gap-2 order-2 lg:order-1" v-if="showSearchResults">
              <h1 class="font-bold text-xl lg:text-5xl">{{ t('nav.news.searchResults') }}</h1>
              <p class="text-base lg:text-2xl" v-html="searchResultText"></p>
            </div>
            <div class="flex gap-4 h-fit items-center" :class="showSearchResults ? 'order-1 lg:order-2' : 'ml-auto'">
              <div class="relative h-fit w-full items-center">
                <Input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('nav.news.searchNews')"
                  class="pl-8"
                  @keyup.enter="handleSearch"
                />
                <span class="absolute top-1/2 -translate-y-1/2 px-2">
                  <Icon name="mdi:search" class="size-5" />
                </span>
              </div>
              <Popover>
                <PopoverTrigger>
                  <div class="flex items-center gap-2 h-fit cursor-pointer">
                    <Icon name="mdi:filter-variant" :class="selectedDate || (dateRange.start && dateRange.end) ? 'size-5 text-red-600' : 'size-5 text-red-100'" />
                    <p :class="selectedDate || (dateRange.start && dateRange.end) ? 'text-red-600 font-medium' : 'text-red-100 font-medium'">{{ t('nav.news.filter') }}</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent class="p-4 border border-gray-200 w-auto">
                  <div class="space-y-4">
                    <div class="flex flex-col gap-2">
                      <h4 class="font-medium text-sm">Filter by Date</h4>
                      <div class="flex gap-2">
                        <Button 
                          @click="filterMode = 'single'" 
                          :variant="filterMode === 'single' ? 'default' : 'outline'"
                          size="sm"
                        >
                          Single Date
                        </Button>
                        <Button 
                          @click="filterMode = 'range'" 
                          :variant="filterMode === 'range' ? 'default' : 'outline'"
                          size="sm"
                        >
                          Date Range
                        </Button>
                      </div>
                    </div>
                    
                    <Calendar
                      v-if="filterMode === 'single'"
                      v-model="selectedDate"
                      @update:model-value="handleDateFilter"
                      :weekday-format="'short'"
                      class="rounded-md border border-grey"
                    />
                    
                    <Calendar
                      v-if="filterMode === 'range'"
                      v-model="dateRange"
                      @update:model-value="handleDateFilter"
                      :weekday-format="'short'"
                      :selection-mode="'range'"
                      class="rounded-md border border-grey"
                    />
                    
                    <div class="flex gap-2" v-if="selectedDate || (dateRange.start && dateRange.end)">
                      <Button @click="clearDateFilter" variant="outline" size="sm" class="w-full">
                        Clear Filter
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <TabsContent :value="currentCategory" class="xl:mt-6 space-y-4 mt-0" :id="Object.keys(hashToCategoryMap).find(hash => hashToCategoryMap[hash] === currentCategory) || currentCategory">
            <!-- News List -->
            <ul class="flex flex-col" v-if="currentNews.length">
              <li v-for="(item, idx) in currentNews" :key="idx">
                <NuxtLink
                  :to="`/news/${item.slug}`"
                  class="flex justify-between items-end gap-6 py-5 border-b border-b-divider"
                >
                  <div class="flex flex-col gap-1">
                    <p class="text-divider text-sm xl:text-base">
                      {{ formatDate(item.published_at) }} | {{ getLocalizedCategory(item.category) }}
                    </p>
                    <h4 class="xl:text-4xl text-xl line-clamp-1 leading-12">
                      {{ getLocalizedTitle(item) }}
                    </h4>
                  </div>
                  <div class="flex items-center gap-2 !min-w-fit">
                    <p class="text-red-100 text-sm xl:text-xl">{{ t('nav.news.readArticle') }}</p>
                    <Icon name="mdi:chevron-right" class="size-5 text-red-100" />
                  </div>
                </NuxtLink>
              </li>
            </ul>
            
            <!-- Empty State -->
            <div v-else class="text-center py-16">
              <img src="/img/no-result.png" :alt="t('nav.news.noNewsFound')" class="size-20 mx-auto mb-6">
              <h3 class="text-xl lg:text-4xl text-black-100 mb-3">{{ t('nav.news.noNewsFound') }}</h3>
              <p class="text-gray-500 mb-8 lg:mb-6 text-base lg:text-2xl">
                {{ searchQuery ? t('nav.news.tryDifferentKeyword') : t('nav.news.noNewsAvailable') }}
              </p>
              <Button v-if="searchQuery" @click="searchQuery = ''; handleSearch()" variant="outline" class="text-sm lg:text-lg">
                {{ t('nav.news.clearSearch') }}
              </Button>
            </div>
          </TabsContent>
          
          <!-- Pagination -->
          <Pagination
            v-if="pagination && pagination.last_page > 1"
            v-slot="{ page }"
            :items-per-page="pagination.per_page"
            :total="pagination.total"
            :default-page="pagination.current_page"
            class="mt-6"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious 
                v-if="pagination.prev_page_url"
                @click="handlePageChange(currentPage - 1)"
              />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === currentPage"
                  @click="handlePageChange(item.value)"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis 
                  v-else-if="item.type === 'ellipsis'" 
                  :index="index" 
                />
              </template>

              <PaginationNext 
                v-if="pagination.next_page_url"
                @click="handlePageChange(currentPage + 1)"
              />
            </PaginationContent>
          </Pagination>
        </Tabs>
      </div>
    </div>
  </div>
</template>
