<script setup lang="ts">
import { getLocalTimeZone, today } from "@internationalized/date";
import { ref, onMounted } from "vue";

const { t } = useI18n();

const value = ref(today(getLocalTimeZone()));

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
const reportsPerPage = ref(10)


const gallery = [
  {
    id: "detail-news-1",
    img: "/img/dummy1.jpg",
    alt: "Gallery 1",
    date: "11 Januari 2024",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
  },
  {
    id: "detail-news-2",
    img: "/img/dummy2.jpg",
    alt: "Gallery 2",
    date: "12 Februari 2024",
    category: "Siaran Pers",
    title: "Lorem Ipsum Dolor Sit Amet",
  },
  {
    id: "detail-news-3",
    img: "/img/dummy3.jpg",
    alt: "Gallery 3",
    date: "13 Maret 2024",
    category: "Bisnis",
    title: "Lorem Ipsum Dolor Sit Amet",
  },
];

const article = [
  {
    date: "11 Januari 2024",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
    id: "detail-news-1",
  },
  {
    date: "12 Februari 2025",
    category: "Bisnis",
    title: "Lorem Ipsum Dolor Sit Amet, Consetetur Adipiscing Elit.",
    id: "detail-news-2",
  },
  {
    date: "13 Maret 2025",
    category: "Kegiatan Perusahaan",
    title:
      "Lorem Ipsum Dolor Sit Amet, Consetetur Adipiscing Elit. Lorem Ipsum Dolor Sit Amet, Consetetur Adipiscing Elit.",
    id: "detail-news-3",
  },
  {
    date: "11 Januari 2025",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
    id: "detail-news-1",
  },
];

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
      year: financialFilterYear.value || undefined
    }
    
    await fetchFinancialReports(params)
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
      year: annualFilterYear.value || undefined
    }
    
    await fetchAnnualReports(params)
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
  financialCurrentPage.value = page
  await loadFinancialReports()
}

const handleAnnualPageChange = async (page: number) => {
  annualCurrentPage.value = page
  await loadAnnualReports()
}

// Lifecycle
onMounted(async () => {
  try {
    console.log('Corporate page mounted, loading reports...')
    console.log('API Base URL:', useRuntimeConfig().public.apiBaseUrl)
    
    // Load reports sequentially to avoid overwhelming the server
    await loadFinancialReports()
    await loadAnnualReports()
    
    console.log('Reports loaded successfully')
  } catch (error) {
    console.error('Failed to load reports data:', error)
    // Don't rethrow to prevent page crash
  }
})
</script>

<template>
  <div>
    <Jumbotron label="Corporate" img="/img/dummy1.jpg" />
    <Tabs default-value="lap-keuangan" class="w-full">
      <TabsList>
        <TabsTrigger value="lap-keuangan">{{ t('nav.corporateMenu.financialReport') }}</TabsTrigger>
        <TabsTrigger value="lap-tahunan">{{ t('nav.corporateMenu.annualReport') }}</TabsTrigger>
        <TabsTrigger value="announcement">{{ t('nav.corporateMenu.announcement') }}</TabsTrigger>
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
                placeholder="Search financial reports..."
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
                  <p class="text-red-100 font-medium">Filter</p>
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
          title="Failed to Load Financial Reports"
          message="An error occurred while fetching financial reports data. Please try again later."
          @retry="loadFinancialReports"
        />

        <!-- Financial Reports Content -->
        <Tabs
          v-else-if="financialReports && Object.keys(financialReports).length > 0"
          default-value="all-category"
          class="w-full"
          orientation="vertical"
        >
          <TabsList class="flex flex-col max-w-full xl:max-w-75 border-0 h-fit">
            <TabsTrigger
              v-for="(tab, key) in financialReports"
              :key="key"
              :value="key"
              class="w-full justify-between px-0"
            >
              {{ tab.title }}
              <Icon name="mdi:chevron-right" class="size-6 text-red-100" />
            </TabsTrigger>
          </TabsList>
          <TabsContent
            v-for="(tab, key) in financialReports"
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
                  <p class="text-xl xl:text-3xl">{{ report.desc }}</p>
                  <p v-if="report.file_size" class="text-sm text-gray-500">{{ report.file_size }}</p>
                </div>
              </button>
            </div>
            <div v-else class="py-12 text-center text-gray-500">
              <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
              <p class="text-lg">No reports available for this category</p>
            </div>
          </TabsContent>
        </Tabs>

        <!-- Empty State -->
        <div v-else class="py-12 text-center text-gray-500">
          <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg">No financial reports available</p>
        </div>
        <Pagination
          v-if="financialReports && Object.keys(financialReports).length > 0 && financialPagination"
          v-slot="{ page }"
          :items-per-page="financialPagination.per_page || reportsPerPage"
          :total="financialPagination.total || 0"
          :default-page="financialCurrentPage"
          class="mt-6"
          @update:page="handleFinancialPageChange"
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
                placeholder="Search annual reports..."
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
                  <p class="text-red-100 font-medium">Filter</p>
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
          title="Failed to Load Annual Reports"
          message="An error occurred while fetching annual reports data. Please try again later."
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
                  class="text-divider text-base xl:text-xl line-clamp-1 xl:line-clamp-2"
                >
                  {{ report.desc }}
                </p>
                <p v-if="report.file_size" class="text-sm text-gray-500">{{ report.file_size }}</p>
              </div>
              <p class="text-red-100 text-base">Lihat Laporan</p>
            </div>
          </button>
        </div>

        <!-- Empty State -->
        <div v-else class="py-12 text-center text-gray-500">
          <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg">No annual reports available</p>
        </div>
        <Pagination
          v-if="Array.isArray(annualReports) && annualReports.length > 0 && annualPagination"
          v-slot="{ page }"
          :items-per-page="annualPagination.per_page || reportsPerPage"
          :total="annualPagination.total || 0"
          :default-page="annualCurrentPage"
          class="mt-6"
          @update:page="handleAnnualPageChange"
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
      <TabsContent value="announcement" class="xl:py-12 xl:px-15 py-8 px-3">
        <div class="py-12 text-center text-gray-500">
          <Icon name="mdi:folder-outline" class="size-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg">Belum ada pengumuman saat ini</p>
        </div>
      </TabsContent>

      <!-- <TabsContent value="announcement" class="xl:py-12 xl:px-15 py-8 px-3">
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
              v-for="i in gallery"
              :key="`slide-basic-${i.id}`"
              class="swiper-slide pb-12"
            >
              <NuxtLink :to="`/news/${i.id}`">
                <div
                  class="shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden"
                >
                  <img
                    :src="i.img"
                    :alt="i.alt"
                    class="w-full h-75 object-cover"
                  />
                  <div class="gap-6 p-4 xl:p-6">
                    <p class="text-sm xl:text-xl text-divider mb-1 xl:mb-3">
                      {{ i.date }} | {{ i.category }}
                    </p>
                    <div class="flex justify-between items-center gap-3">
                      <p
                        class="xl:text-5xl text-xl text-black-100 line-clamp-1"
                      >
                        {{ i.title }}
                      </p>
                      <div class="flex items-center gap-2">
                        <p class="text-red-100 text-sm xl:text-xl">
                          Baca Artikel
                        </p>
                        <Icon
                          name="mdi:chevron-right"
                          class="xl:size-5 size-4 text-red-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
        <div class="flex justify-between flex-col lg:flex-row my-5 gap-6">
          <div class="flex flex-col gap-2 order-2 lg:order-1">
            <h1 class="font-bold text-xl lg:text-5xl">Hasil Pencarian</h1>
            <p class="text-base lg:text-2xl">
              5 hasil ditemukan dengan keyword <b>lorem</b>
            </p>
          </div>
          <div class="flex gap-4 h-fit items-center order-1 lg:order-2">
            <div class="relative h-fit w-full items-center">
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                class="pl-8"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">Filter</p>
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
        <ul class="flex flex-col">
          <li v-for="(i, index) in article" :key="index">
            <NuxtLink
              :to="`/news/${i.id}`"
              class="flex justify-between items-end gap-6 py-5 border-b border-b-divider"
            >
              <div class="flex flex-col gap-1">
                <p class="text-divider text-sm xl:text-base">
                  {{ i.date }} | {{ i.category }}
                </p>
                <h4 class="xl:text-4xl text-xl line-clamp-1">{{ i.title }}</h4>
              </div>
              <div class="flex items-center gap-2 !min-w-fit">
                <p class="text-red-100 text-sm xl:text-xl">Baca Artikel</p>
                <Icon name="mdi:chevron-right" class="size-5 text-red-100" />
              </div>
            </NuxtLink>
          </li>
        </ul>
        <Pagination
          v-slot="{ page }"
          :items-per-page="10"
          :total="30"
          :default-page="1"
          class="mt-6"
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
      </TabsContent> -->
    </Tabs>
  </div>
</template>
