<script setup lang="ts">
import { getLocalTimeZone, today } from "@internationalized/date";
import { ref, onMounted, watch, nextTick } from "vue";

const { t, locale } = useI18n();
const apiStore = useApiStore();

const value = ref(today(getLocalTimeZone()));

// Banner data
const bannerData = ref({})

// Announcements state
const announcements = ref([])
const announcementsLoading = ref(false)
const announcementsError = ref(null)
const announcementsSearchQuery = ref('')
const announcementsCurrentPage = ref(1)
const announcementsPagination = ref(null)
const featuredAnnouncement = ref(null)


// Reports API integration
const { 
  financialReports, 
  annualReports, 
  isLoading: reportsLoading, 
  error: reportsError,
  financialPagination,
  annualPagination,
  fetchFinancialReports, 
  fetchAnnualReports,
  downloadReport 
} = useReports()

// Loading and error states
const isLoadingFinancial = ref(false)
const isLoadingAnnual = ref(false)
const errorFinancial = ref<any>(null)
const errorAnnual = ref<any>(null)

// Search and filter states
const financialSearchQuery = ref('')
const annualSearchQuery = ref('')
const financialFilterYear = ref<number | null>(null)
const annualFilterYear = ref<number | null>(null)
const financialCurrentPage = ref(1)
const annualCurrentPage = ref(1)
const reportsPerPage = ref(4)

// Fetch reports data
const loadFinancialReports = async (resetPage = false) => {
  try {
    isLoadingFinancial.value = true
    errorFinancial.value = null
    
    if (resetPage) {
      financialCurrentPage.value = 1
    }
    
    const params = {
      limit: reportsPerPage.value,
      page: financialCurrentPage.value,
      search: financialSearchQuery.value || undefined,
      year: financialFilterYear.value || undefined,
      lang: locale.value
    }
    
    console.log('💰 Loading financial reports with params:', params)
    await fetchFinancialReports(params)
    console.log('📊 Financial reports loaded, pagination:', financialPagination.value)
  } catch (err) {
    errorFinancial.value = err
    console.error('Failed to load financial reports:', err)
  } finally {
    isLoadingFinancial.value = false
  }
}

const loadAnnualReports = async (resetPage = false) => {
  try {
    isLoadingAnnual.value = true
    errorAnnual.value = null
    
    if (resetPage) {
      annualCurrentPage.value = 1
    }
    
    const params = {
      limit: reportsPerPage.value,
      page: annualCurrentPage.value,
      search: annualSearchQuery.value || undefined,
      year: annualFilterYear.value || undefined,
      lang: locale.value
    }
    
    console.log('📋 Loading annual reports with params:', params)
    await fetchAnnualReports(params)
    console.log('📄 Annual reports loaded:', annualReports.value.length, 'reports')
  } catch (err) {
    errorAnnual.value = err
    console.error('Failed to load annual reports:', err)
  } finally {
    isLoadingAnnual.value = false
  }
}

// Handle report download
const handleReportDownload = async (reportId) => {
  try {
    await downloadReport(reportId)
  } catch (err) {
    console.error('Failed to download report:', err)
    // You could show a toast notification here
  }
}

// Search and filter handlers
const handleFinancialSearch = async () => {
  await loadFinancialReports(true) // Reset to page 1
}

const handleAnnualSearch = async () => {
  await loadAnnualReports(true) // Reset to page 1
}

const handleFinancialFilterChange = async (selectedDate: any) => {
  if (selectedDate) {
    financialFilterYear.value = selectedDate.year
  } else {
    financialFilterYear.value = null
  }
  await loadFinancialReports(true)
}

const handleAnnualFilterChange = async (selectedDate: any) => {
  if (selectedDate) {
    annualFilterYear.value = selectedDate.year
  } else {
    annualFilterYear.value = null
  }
  await loadAnnualReports(true)
}

// Pagination handlers
const handleFinancialPageChange = async (page: number) => {
  console.log('🔄 Changing financial page to:', page)
  financialCurrentPage.value = page
  await loadFinancialReports()
  console.log('✅ Financial page changed, current page:', financialCurrentPage.value)
}

const handleAnnualPageChange = async (page: number) => {
  console.log('🔄 Changing annual page to:', page)
  annualCurrentPage.value = page
  await loadAnnualReports()
  console.log('✅ Annual page changed, current page:', annualCurrentPage.value)
}

// Hash navigation mapping
const hashToTabMap = {
  'financial-report': 'lap-keuangan',
  'annual-report': 'lap-tahunan',
  'announcement': 'announcement'
}

// Current tab state
const currentTab = ref('lap-keuangan')

// Handle hash navigation
const handleHashNavigation = () => {
  if (process.client && window.location.hash) {
    const hash = window.location.hash.slice(1) // Remove #
    if (hashToTabMap[hash]) {
      currentTab.value = hashToTabMap[hash]
    }
  }
}

// Helper functions for localized content
const getLocalizedTitle = (item: any) => {
  if (!item) return ''
  if (locale.value === 'en' && item.title_en) {
    return item.title_en
  }
  if (item.title_id) {
    return item.title_id
  }
  return item.title || ''
}

const getLocalizedReportDesc = (report: any) => {
  if (!report) return ''
  if (locale.value === 'en' && report.desc_en) {
    return report.desc_en
  }
  if (report.desc_id) {
    return report.desc_id
  }
  return report.desc || ''
}

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
    ? bannerData.value.banner_corporate_title_id 
    : bannerData.value.banner_corporate_title_en
  
  const defaultTitle = locale.value === 'id' ? 'Corporate' : 'Corporate'
  return extractConfigValue(titleField) || defaultTitle
})

const bannerDescription = computed(() => {
  const descField = locale.value === 'id' 
    ? bannerData.value.banner_corporate_description_id 
    : bannerData.value.banner_corporate_description_en
  
  return extractConfigValue(descField) || ''
})

const bannerImage = computed(() => {
  return extractConfigValue(bannerData.value.banner_corporate_image) || '/img/dummy1.jpg'
})

// Computed property to filter out monthly and quarterly financial reports tabs
const filteredFinancialReports = computed(() => {
  if (!financialReports.value) return null
  
  const filtered = { ...financialReports.value }
  // Remove monthly and quarterly tabs
  delete filtered.bulanan
  delete filtered.triwulan
  
  return filtered
})

// Lifecycle
onMounted(async () => {
  try {
    console.log('Corporate page mounted, loading reports...')
    console.log('API Base URL:', useRuntimeConfig().public.apiBaseUrl)
    
    // Fetch banner data
    await fetchBannerData()
    
    // Load reports sequentially to avoid overwhelming the server
    console.log('🔄 About to load financial reports...')
    await loadFinancialReports()
    console.log('💰 Financial reports after load:', financialReports.value)
    
    console.log('🔄 About to load annual reports...')
    await loadAnnualReports()
    console.log('📊 Annual reports after load:', annualReports.value.length, 'items')
    
    console.log('🎯 Fetching announcements on mount...')
    await fetchAnnouncements()
    console.log('📢 Announcements after fetch:', announcements.value)
    
    console.log('Reports loaded successfully')
  } catch (error) {
    console.error('Failed to load reports data:', error)
    // Don't rethrow to prevent page crash
  }
  
  // Handle hash navigation on page load
  nextTick(() => {
    handleHashNavigation()
  })
})

// Fetch announcements function
const fetchAnnouncements = async () => {
  try {
    announcementsLoading.value = true
    announcementsError.value = null
    
    const params: any = {
      type: 'announcement',
      page: announcementsCurrentPage.value,
      limit: 5
    }
    
    if (announcementsSearchQuery.value) {
      params.search = announcementsSearchQuery.value
    }
    
    const response = await apiStore.fetchNews(params)
    console.log('🎯 API call params:', params)
    console.log('✅ Fetched announcements:', response.data.data)
    console.log('📊 Data types:', response.data.data.map(item => ({id: item.id, type: item.type, title: item.title_id})))
    
    // Filter hanya yang type announcement (double check)
    const filteredAnnouncements = response.data.data.filter(item => item.type === 'announcement')
    console.log('🔥 Filtered announcements only:', filteredAnnouncements)
    
    announcements.value = filteredAnnouncements
    announcementsPagination.value = {
      ...response.data,
      data: filteredAnnouncements,
      total: filteredAnnouncements.length
    }
    
    // Get featured announcement for the top section
    if (announcementsCurrentPage.value === 1 && !announcementsSearchQuery.value) {
      const featuredResponse = await apiStore.fetchNews({ 
        type: 'announcement', 
        featured: true, 
        limit: 1 
      })
      console.log('🎯 Featured announcement response:', featuredResponse)
      if (featuredResponse.data.data.length > 0) {
        featuredAnnouncement.value = featuredResponse.data.data[0]
        console.log('✅ Featured announcement set:', featuredAnnouncement.value)
        console.log('🖼️ Featured image URL:', featuredAnnouncement.value.featured_image_url)
        console.log('🖼️ Featured image path:', featuredAnnouncement.value.featured_image)
      } else {
        console.log('❌ No featured announcements found')
        // Fallback: get the first announcement as featured
        if (filteredAnnouncements.length > 0) {
          featuredAnnouncement.value = filteredAnnouncements[0]
          console.log('🔄 Using first announcement as featured:', featuredAnnouncement.value)
          console.log('🖼️ Fallback image URL:', featuredAnnouncement.value.featured_image_url)
          console.log('🖼️ Fallback image path:', featuredAnnouncement.value.featured_image)
        }
      }
    }
    
  } catch (err) {
    announcementsError.value = err
    console.error('Failed to fetch announcements:', err)
  } finally {
    announcementsLoading.value = false
  }
}

// Announcement handlers
const handleAnnouncementSearch = () => {
  announcementsCurrentPage.value = 1
  fetchAnnouncements()
}

const handleAnnouncementPageChange = (page: number) => {
  announcementsCurrentPage.value = page
  fetchAnnouncements()
}

// Watch for language changes
watch(() => locale.value, async () => {
  try {
    // Reload banner and reports when language changes
    await fetchBannerData()
    await loadFinancialReports()
    await loadAnnualReports()
    await fetchAnnouncements()
  } catch (error) {
    console.error('Failed to reload reports after language change:', error)
  }
}, { immediate: false })


// Watch search query with debounce for announcements
const debouncedAnnouncementSearch = ref('')
watch(() => announcementsSearchQuery.value, (newValue) => {
  clearTimeout(debouncedAnnouncementSearch.value)
  debouncedAnnouncementSearch.value = setTimeout(() => {
    handleAnnouncementSearch()
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
    <Jumbotron :label="bannerTitle" :desc="bannerDescription" :img="bannerImage" />
    <Tabs :model-value="currentTab" class="w-full">
      <TabsList>
        <TabsTrigger value="lap-keuangan" id="financial-report" @click="currentTab = 'lap-keuangan'">{{ t('nav.corporateMenu.financialReport') }}</TabsTrigger>
        <TabsTrigger value="lap-tahunan" id="annual-report" @click="currentTab = 'lap-tahunan'">{{ t('nav.corporateMenu.annualReport') }}</TabsTrigger>
        <TabsTrigger value="announcement" id="announcement" @click="currentTab = 'announcement'">{{ t('nav.corporateMenu.announcement') }}</TabsTrigger>
      </TabsList>
      <TabsContent value="lap-keuangan" class="xl:py-12 xl:px-15 py-8 px-3">
        <div
          class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 mb-6 border-b border-b-divider"
        >
          <h1 class="font-bold xl:text-5xl text-2xl">{{ t('nav.corporateMenu.financialReport') }}</h1>
          <div class="flex gap-4 h-fit items-center w-full md:w-1/2 lg:w-1/4">
            <div class="relative h-fit w-full items-center">
              <Input
                id="financial-search"
                v-model="financialSearchQuery"
                type="text"
                :placeholder="t('corporate.searchFinancialReports')"
                class="pl-8"
                @keyup.enter="handleFinancialSearch"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">{{ t('corporate.filter') }}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent class="p-0 border-0">
                <Calendar
                  :weekday-format="'short'"
                  class="rounded-md border border-grey"
                  @update:model-value="handleFinancialFilterChange"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <!-- Loading State -->
        <ReportsSkeleton v-if="isLoadingFinancial" type="financial" :count="6" />

        <!-- Error State -->
        <ErrorAlert 
          v-else-if="errorFinancial" 
          :error="errorFinancial"
          :title="t('corporate.failedToLoadFinancialReports')"
          :message="t('corporate.financialReportsLoadError')"
          @retry="loadFinancialReports"
        />

        <!-- Financial Reports Content -->
        <Tabs
          v-else-if="filteredFinancialReports && Object.keys(filteredFinancialReports).length > 0"
          default-value="all-category"
          class="w-full"
          orientation="vertical"
        >
          <TabsList class="flex flex-col max-w-full xl:max-w-75 border-0 h-fit">
            <TabsTrigger
              v-for="(tab, key) in filteredFinancialReports"
              :key="key"
              :value="key"
              class="w-full justify-between px-0"
            >
              {{ getLocalizedTitle(tab) }}
              <Icon name="mdi:chevron-right" class="size-6 text-red-100" />
            </TabsTrigger>
          </TabsList>
          <TabsContent
            v-for="(tab, key) in filteredFinancialReports"
            :key="key"
            :value="key"
          >
            <div v-if="tab.subKeuangan && tab.subKeuangan.length > 0" class="flex flex-col gap-6">
              <button
                v-for="(report, index) in tab.subKeuangan"
                :key="index"
                @click="handleReportDownload(report.id)"
                class="flex rounded-xl xl:rounded-3xl overflow-hidden shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div
                  class="bg-red-100 px-6 xl:px-12 flex items-center justify-center"
                >
                  <Icon
                    name="mdi:folder-open-outline"
                    class="size-10 xl:size-12 text-white"
                  />
                </div>
                <div class="flex flex-col p-4 xl:p-6 gap-2 w-full text-left">
                  <p class="text-base xl:text-xl text-divider">
                    {{ report.year }}{{ report.month ? ` | ${report.month}` : '' }}
                  </p>
                  <p class="text-xl xl:text-3xl">{{ getLocalizedReportDesc(report) }}</p>
                  <p v-if="report.file_size" class="text-sm text-gray-500">{{ report.file_size }}</p>
                </div>
              </button>
            </div>
            <div v-else class="py-12 text-center text-gray-500">
              <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
              <p class="text-lg">{{ t('corporate.noReportsAvailableCategory') }}</p>
            </div>
          </TabsContent>
        </Tabs>

        <!-- Empty State -->
        <div v-else class="py-12 text-center text-gray-500">
          <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg">{{ t('corporate.noFinancialReportsAvailable') }}</p>
        </div>
        <Pagination
          v-if="filteredFinancialReports && Object.keys(filteredFinancialReports).length > 0 && financialPagination"
          v-slot="{ page }"
          :items-per-page="parseInt(financialPagination.per_page) || reportsPerPage"
          :total="financialPagination.total || 0"
          :default-page="financialCurrentPage"
          class="mt-6"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious 
              v-if="financialCurrentPage > 1"
              @click="handleFinancialPageChange(financialCurrentPage - 1)"
            />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === financialCurrentPage"
                @click="handleFinancialPageChange(item.value)"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis 
                v-else-if="item.type === 'ellipsis'" 
                :index="index" 
              />
            </template>

            <PaginationNext 
              v-if="financialPagination && financialCurrentPage < financialPagination.last_page"
              @click="handleFinancialPageChange(financialCurrentPage + 1)"
            />
          </PaginationContent>
        </Pagination>
      </TabsContent>
      <TabsContent value="lap-tahunan" class="xl:py-12 xl:px-15 py-8 px-3">
        <div
          class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 mb-6 border-b border-b-divider"
        >
          <h1 class="font-bold xl:text-5xl text-2xl">{{ t('nav.corporateMenu.annualReport') }}</h1>
          <div class="flex gap-4 h-fit items-center w-full md:w-1/2 lg:w-1/4">
            <div class="relative h-fit w-full items-center">
              <Input
                id="annual-search"
                v-model="annualSearchQuery"
                type="text"
                :placeholder="t('corporate.searchAnnualReports')"
                class="pl-8"
                @keyup.enter="handleAnnualSearch"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">{{ t('corporate.filter') }}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent class="p-0 border-0">
                <Calendar
                  :weekday-format="'short'"
                  class="rounded-md border border-grey"
                  @update:model-value="handleAnnualFilterChange"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <!-- Loading State -->
        <ReportsSkeleton v-if="isLoadingAnnual" type="annual" :count="4" />

        <!-- Error State -->
        <ErrorAlert 
          v-else-if="errorAnnual" 
          :error="errorAnnual"
          :title="t('corporate.failedToLoadAnnualReports')"
          :message="t('corporate.annualReportsLoadError')"
          @retry="loadAnnualReports"
        />

        <!-- Annual Reports Content -->
        <div v-else-if="Array.isArray(annualReports) && annualReports.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <button
            v-for="(report, index) in annualReports"
            :key="index"
            @click="handleReportDownload(report.id)"
            class="flex h-auto xl:h-50 rounded-xl xl:rounded-3xl overflow-hidden shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div
              class="bg-red-100 px-6 xl:px-12 flex items-center justify-center"
            >
              <Icon
                name="mdi:folder-open-outline"
                class="size-10 xl:size-15 text-white"
              />
            </div>
            <div class="flex flex-col p-4 xl:p-6 gap-6 justify-between w-full text-left">
              <div class="flex flex-col gap-3">
                <p class="xl:text-3xl text-xl">{{ report.year }}</p>
                <p
                  class="text-divider text-base xl:text-xl line-clamp-1"
                >
                  {{ getLocalizedReportDesc(report) }}
                </p>
                <p v-if="report.file_size" class="text-sm text-gray-500">{{ report.file_size }}</p>
              </div>
              <p class="text-red-100 text-base">{{ t('corporate.viewReport') }}</p>
            </div>
          </button>
        </div>

        <!-- Empty State -->
        <div v-else class="py-12 text-center text-gray-500">
          <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg">{{ t('corporate.noAnnualReportsAvailable') }}</p>
        </div>
        <Pagination
          v-if="Array.isArray(annualReports) && annualReports.length > 0 && annualPagination"
          v-slot="{ page }"
          :items-per-page="parseInt(annualPagination.per_page) || reportsPerPage"
          :total="annualPagination.total || 0"
          :default-page="annualCurrentPage"
          class="mt-6"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious 
              v-if="annualCurrentPage > 1"
              @click="handleAnnualPageChange(annualCurrentPage - 1)"
            />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === annualCurrentPage"
                @click="handleAnnualPageChange(item.value)"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis 
                v-else-if="item.type === 'ellipsis'" 
                :index="index" 
              />
            </template>

            <PaginationNext 
              v-if="annualPagination && annualCurrentPage < annualPagination.last_page"
              @click="handleAnnualPageChange(annualCurrentPage + 1)"
            />
          </PaginationContent>
        </Pagination>
      </TabsContent>
      <TabsContent value="announcement" class="xl:py-12 xl:px-15 py-8 px-3">
        <!-- Featured Announcement Slider -->
        <div v-if="featuredAnnouncement && !announcementsSearchQuery" class="mb-12">
          <h1 class="text-black-100 font-bold xl:text-5xl text-2xl mb-6 xl:mb-9">
            {{ t('nav.corporateMenu.announcement') }}
          </h1>
          <ClientOnly>
            <div class="shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
              <NuxtLink :to="`/news/${featuredAnnouncement.slug}`">
                <img 
                  v-if="featuredAnnouncement.featured_image_url || featuredAnnouncement.featured_image"
                  :src="featuredAnnouncement.featured_image_url || (featuredAnnouncement.featured_image?.startsWith('http') ? featuredAnnouncement.featured_image : `${apiStore.baseURL}/storage/${featuredAnnouncement.featured_image}`)"
                  :alt="featuredAnnouncement.title_id"
                  class="w-full h-75 object-cover"
                />
                <div class="gap-6 p-4 xl:p-6">
                  <p class="text-sm xl:text-xl text-divider mb-1 xl:mb-3">
                    {{ new Date(featuredAnnouncement.published_at).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) }} | {{ featuredAnnouncement.category || 'Announcement' }}
                  </p>
                  <div class="flex justify-between items-center gap-3">
                    <p class="xl:text-5xl text-xl text-black-100 line-clamp-1">
                      {{ locale === 'en' && featuredAnnouncement.title_en ? featuredAnnouncement.title_en : featuredAnnouncement.title_id }}
                    </p>
                    <div class="flex items-center gap-2">
                      <p class="text-red-100 text-sm xl:text-xl">
                        {{ t('nav.news.readArticle') }}
                      </p>
                      <Icon name="mdi:arrow-right" class="text-red-100 size-6" />
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </ClientOnly>
        </div>

        <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 mb-6 border-b border-b-divider">
          <div>
            <h2 class="text-2xl font-semibold mb-2">
              {{ announcementsSearchQuery ? 'Hasil Pencarian' : t('nav.corporateMenu.announcement') }}
            </h2>
            <p class="text-gray-600" v-if="announcementsPagination && announcementsSearchQuery">
              {{ announcementsPagination.total }} hasil ditemukan dengan keyword "{{ announcementsSearchQuery }}"
            </p>
            <p class="text-gray-600" v-else-if="announcementsPagination">
              {{ announcementsPagination.total }} {{ announcementsPagination.total === 1 ? 'announcement' : 'announcements' }} tersedia
            </p>
          </div>
          <div class="flex gap-3">
            <div class="relative h-fit w-full items-center">
              <Input
                id="announcement-search"
                v-model="announcementsSearchQuery"
                type="text"
                :placeholder="t('nav.news.searchNews')"
                class="pl-8"
                @keyup.enter="handleAnnouncementSearch"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">{{ t('corporate.filter') }}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent class="p-0 border-0">
                <Calendar
                  v-model="value"
                  :weekday-format="'short'"
                  class="rounded-md border border-grey"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="announcementsLoading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <!-- Error State -->
        <ErrorAlert 
          v-else-if="announcementsError" 
          :error="announcementsError"
          :title="t('error.loadDataFailed')"
          :message="t('error.newsPageLoadError')"
          @retry="fetchAnnouncements"
        />

        <!-- Empty State -->
        <div v-else-if="!announcements.length" class="py-12 text-center text-gray-500">
          <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg">{{ t('corporate.noAnnouncementsAvailable') }}</p>
        </div>

        <!-- Announcements List -->
        <div v-else>
          <ul class="flex flex-col">
            <li v-for="announcement in announcements" :key="announcement.id">
            <NuxtLink
              :to="`/news/${announcement.slug}`"
              class="flex justify-between items-end gap-6 py-5 border-b border-b-divider"
            >
              <div class="flex flex-col gap-1">
                <p class="text-divider text-sm xl:text-base">
                  {{ new Date(announcement.published_at).toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) }}
                </p>
                <h4 class="xl:text-4xl text-xl line-clamp-1 leading-12">
                  {{ locale === 'en' && announcement.title_en ? announcement.title_en : announcement.title_id }}
                </h4>
              </div>
              <div class="flex items-center gap-2 !min-w-fit">
                <p class="text-red-100 text-sm xl:text-xl">{{ t('nav.news.readArticle') }}</p>
                <Icon name="mdi:chevron-right" class="size-5 text-red-100" />
              </div>
            </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="announcementsPagination && announcementsPagination.last_page > 1"
          v-slot="{ page }"
          :items-per-page="announcementsPagination.per_page || 5"
          :total="announcementsPagination.total || 0"
          :default-page="announcementsCurrentPage"
          class="mt-6"
          @update:page="handleAnnouncementPageChange"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis :index="4" />

            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </TabsContent>

    </Tabs>
  </div>
</template>
