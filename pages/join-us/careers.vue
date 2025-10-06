<template>
  <div>
    <!-- Loading State -->
    <CareersPageSkeleton v-if="pending" :items-to-show="4" />
    
    <!-- Content State -->
    <div v-else>
      <!-- Hero Section -->
      <div class="relative px-3 h-50 xl:h-100 flex flex-col items-center justify-center bg-red-100 overflow-hidden">
        <img
          src="/img/dummy1.jpg"
          alt="Careers at TEZ Capital"
          class="absolute inset-0 w-full h-full object-cover opacity-70 object-center"
        />
        <div class="absolute inset-0 bg-red-100/65 mix-blend-multiply"></div>
        <h1 class="relative z-10 text-white xl:text-5xl text-2xl font-bold text-center">
          {{ t('joinUs.careers.title') }}
        </h1>
      </div>
      
      <section class="py-8 xl:py-12">
        <div class="px-3 xl:px-15">
          <div class="text-center mb-6 xl:mb-12">
            <h2 class="xl:text-4xl text-2xl font-bold text-black-100 mb-6 xl:mb-8">
              {{ t('joinUs.beAPartOfOurTeam') }}
            </h2>

            <div class="max-w-6xl mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8">
                <!-- Search Input -->
                <div class="relative">
                  <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-divider size-5" />
                  <input
                    v-model="searchQuery"
                    @input="debouncedSearch"
                    type="text"
                    :placeholder="t('joinUs.searchPlaceholder')"
                    class="w-full pl-10 pr-4 py-3 border border-divider rounded-full focus:outline-none focus:border-red-100 text-base bg-white"
                  />
                </div>
                
                <!-- Department Filter -->
                <div class="relative">
                  <select
                    v-model="selectedDepartment"
                    @change="handleFiltersChange"
                    class="appearance-none bg-white border border-divider rounded-full px-6 py-3 pr-10 focus:outline-none focus:border-red-100 text-base cursor-pointer w-full"
                  >
                    <option value="">{{ t('joinUs.allDepartments') }}</option>
                    <option 
                      v-for="dept in availableDepartments"
                      :key="dept"
                      :value="dept"
                    >
                      {{ dept }}
                    </option>
                  </select>
                  <Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-divider size-5 pointer-events-none" />
                </div>

                <!-- Location Filter -->
                <div class="relative">
                  <select
                    v-model="selectedLocation"
                    @change="handleFiltersChange"
                    class="appearance-none bg-white border border-divider rounded-full px-6 py-3 pr-10 focus:outline-none focus:border-red-100 text-base cursor-pointer w-full"
                  >
                    <option value="">{{ t('joinUs.allLocations') }}</option>
                    <option 
                      v-for="loc in availableLocations"
                      :key="loc"
                      :value="loc"
                    >
                      {{ loc }}
                    </option>
                  </select>
                  <Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-divider size-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <!-- Job Listings -->
          <div class="max-w-6xl mx-auto">
            <div v-if="careers?.data?.data && careers.data.data.length > 0">
              <!-- Job Items -->
              <div class="space-y-0">
                <NuxtLink 
                  v-for="career in displayedCareers"
                  :key="career.id"
                  :to="`/join-us/detail-job/${career.slug}`"
                  class="block border-b border-grey py-4 hover:bg-gray-50 transition-all duration-300"
                >
                  <div class="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8 items-start">
                    <!-- Job Title Column -->
                    <div class="flex flex-col">
                      <span class="text-sm font-medium mb-1 text-red-100">
                        {{ career.department_id || t('joinUs.department') }}
                      </span>
                      <h3 class="text-black-100 font-semibold text-base xl:text-lg">
                        {{ career.title_id }}
                      </h3>
                    </div>
                    
                    <!-- Department Column -->
                    <div class="flex flex-col pl-8">
                      <span class="text-divider text-sm font-medium mb-1">{{ t('joinUs.department') }}</span>
                      <span class="text-black-100 text-base xl:text-lg font-semibold">
                        {{ career.department_id || (career.tags && career.tags.length > 0 ? career.tags[0] : '-') }}
                      </span>
                    </div>
                    
                    <!-- Location Column -->
                    <div class="flex flex-col">
                      <span class="text-divider text-sm font-medium mb-1">{{ t('joinUs.location') }}</span>
                      <span class="text-black-100 text-base xl:text-lg font-semibold">{{ career.location_id }}</span>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <div v-else-if="!pending" class="py-12 xl:py-20 text-center">
              <Icon name="mdi:briefcase-search" class="w-16 h-16 xl:w-20 xl:h-20 text-divider mx-auto mb-4 xl:mb-6" />
              <h3 class="text-lg xl:text-2xl font-bold text-black-100 mb-2 xl:mb-3">
                {{ t('joinUs.careers.noJobsFound') }}
              </h3>
              <p class="text-divider text-base xl:text-lg">
                {{ t('joinUs.careers.tryChangingFilters') }}
              </p>
            </div>

            <!-- Pagination -->
            <div v-if="shouldShowPagination" class="flex justify-center mt-8 xl:mt-12">
              <div class="flex gap-2">
                <template v-for="(link, index) in careers.data.links" :key="index">
                  <button
                    v-if="link.url"
                    :class="[
                      'px-3 py-1 text-sm font-medium rounded transition-all duration-300',
                      link.active 
                        ? 'bg-red-100 text-white' 
                        : 'bg-white text-black-100 border border-divider hover:bg-gray-50'
                    ]"
                    @click="handlePaginationClick(link.url)"
                    v-html="link.label"
                  />
                  <span
                    v-else
                    class="px-3 py-1 text-sm text-gray-400"
                    v-html="link.label"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CareerApiResponse } from '~/composables/useCareers'

const { t } = useI18n()
const { getCareers } = useCareers()

// State
const currentPage = ref(1)
const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedLocation = ref('')
const itemsPerPage = ref(5)
const availableDepartments = ref<string[]>([])
const availableLocations = ref<string[]>([])

// Reactive state for careers data
const careers = ref<CareerApiResponse | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)

// Fetch careers function
const fetchCareers = async () => {
  try {
    pending.value = true
    error.value = null
    
    // Always use limit 5 for consistent pagination, but only show 4 items on initial load in frontend
    const response = await getCareers({
      search: searchQuery.value || undefined,
      department: selectedDepartment.value || undefined,
      location: selectedLocation.value || undefined,
      page: currentPage.value,
      limit: 5
    })
    
    careers.value = response
  } catch (err) {
    error.value = err?.message || 'Failed to fetch careers'
    console.error('Error fetching careers:', err)
  } finally {
    pending.value = false
  }
}

// Refresh function
const refresh = () => fetchCareers()

// Initialize departments and locations
availableDepartments.value = ['Finance', 'People & Operation', 'Technology', 'Marketing']
availableLocations.value = ['Jakarta', 'Surabaya', 'Bandung']

// Initial fetch
onMounted(() => {
  fetchCareers()
})

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh()
  }, 500)
}

// Handle filter changes
const handleFiltersChange = () => {
  currentPage.value = 1
  refresh()
}

// Pagination
const handlePaginationClick = async (url: string) => {
  const urlParams = new URL(url)
  const page = urlParams.searchParams.get('page')
  if (page) {
    const pageNum = parseInt(page)
    // Prevent clicking to pages that would be empty
    if (careers.value?.data?.last_page && pageNum > careers.value.data.last_page) {
      return
    }
    currentPage.value = pageNum
    refresh()
  }
}

// Show different amount on initial load vs paginated view
const isInitialLoad = computed(() => currentPage.value === 1 && !searchQuery.value && !selectedDepartment.value && !selectedLocation.value)

// Get careers to display (limit to 4 on initial load)
const displayedCareers = computed(() => {
  if (!careers.value?.data?.data) return []
  
  const allCareers = careers.value.data.data
  
  // On initial load, show only 4 items
  if (isInitialLoad.value) {
    return allCareers.slice(0, 4)
  }
  
  // On other pages, show all items from API
  return allCareers
})

// Determine if pagination should be shown
const shouldShowPagination = computed(() => {
  if (!careers.value?.data) return false
  
  const { links, last_page, total, data } = careers.value.data
  
  // Don't show pagination if:
  // 1. No links or insufficient links
  // 2. Only 1 page total
  // 3. No data at all
  // 4. On initial load and total <= 4, or on other pages and total <= 5
  if (!links || links.length <= 3 || last_page <= 1 || !data?.length) {
    return false
  }
  
  // For initial load, show pagination if more than 4 items
  if (isInitialLoad.value && total <= 4) {
    return false
  }
  
  return true
})

// Reset page when filters change
watch([selectedDepartment, selectedLocation], () => {
  currentPage.value = 1
  refresh()
})

useHead({
  title: 'Careers - TEZ Capital Finance',
  meta: [
    { name: 'description', content: 'Temukan peluang karir terbaik di TEZ Capital Finance. Bergabunglah dengan tim profesional kami dan kembangkan karir Anda.' }
  ]
})
</script>