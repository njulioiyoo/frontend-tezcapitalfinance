<script setup lang="ts">
import type { ServicesResponse, ServiceItem } from '~/types/api'

const { t, locale } = useI18n()
const apiStore = useApiStore()

// Banner data
const bannerData = ref({})
const isLoading = ref(true)
const error = ref<any>(null)

// Services data
const servicesResponse = ref<ServicesResponse | null>(null)
const currentPage = ref(1)

// Reactive data
const services = computed(() => {
  return servicesResponse.value?.data?.data || []
})

const pagination = computed(() => {
  return servicesResponse.value?.data || null
})

const categories = computed(() => {
  return servicesResponse.value?.categories || {}
})

// Helper functions
const getLocalizedTitle = (service: ServiceItem) => {
  return locale.value === 'en' && service.title_en ? service.title_en : service.title_id
}

const getLocalizedDescription = (service: ServiceItem) => {
  return locale.value === 'en' && service.excerpt_en ? service.excerpt_en : service.excerpt_id
}

// API functions
const fetchServices = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const params: any = {
      page: currentPage.value,
      limit: 3
    }
    
    const response = await apiStore.fetchServices(params)
    servicesResponse.value = response
    
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => {
  fetchServices()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchServices()
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
    ? bannerData.value.banner_services_title_id 
    : bannerData.value.banner_services_title_en
  
  const defaultTitle = locale.value === 'id' ? 'Layanan Kami' : 'Our Services'
  return extractConfigValue(titleField) || defaultTitle
})

const bannerDescription = computed(() => {
  const descField = locale.value === 'id' 
    ? bannerData.value.banner_services_description_id 
    : bannerData.value.banner_services_description_en
  
  return extractConfigValue(descField) || ''
})

const bannerImage = computed(() => {
  return extractConfigValue(bannerData.value.banner_services_image) || '/img/dummy1.jpg'
})

// Lifecycle
onMounted(() => {
  fetchBannerData()
  fetchServices()
})

// Watch for language changes and refetch data
watch(() => locale.value, () => {
  fetchBannerData()
  fetchServices()
}, { immediate: false })
</script>

<template>
  <div>
    <Jumbotron :label="bannerTitle" :desc="bannerDescription" :img="bannerImage" />
    
    <!-- Loading State -->
    <ServicePageSkeleton v-if="isLoading" />
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      :title="t('error.loadDataFailed')"
      :message="t('error.servicePageLoadError')"
      @retry="retryFetch"
    />
    
    <!-- Content State -->
    <div v-else class="px-3 xl:px-15 py-8 xl:py-12">
      <div class="flex flex-col divide-y divide-divider" v-if="services.length">
        <NuxtLink
          v-for="service in services"
          :key="service.id"
          :to="`/service/${service.slug}`"
          class="flex flex-col xl:flex-row gap-6 items-center xl:items-start py-6 xl:py-9 min-h-32 xl:min-h-40"
        >
          <img
            :src="service.featured_image_url || '/img/services/1.png'"
            :alt="getLocalizedTitle(service)"
            class="w-25 h-25 xl:w-37.5 xl:h-37.5 object-contain object-center"
          />
          <div class="flex flex-col gap-6 flex-1">
            <h2 class="xl:text-4xl text-2xl font-bold text-center xl:text-left">
              {{ getLocalizedTitle(service) }}
            </h2>
            <p class="xl:text-xl text-base text-center xl:text-left">
              {{ getLocalizedDescription(service) }}
            </p>
            <div class="flex items-center justify-center xl:justify-end gap-2 mt-auto">
              <p class="text-red-100 text-sm xl:text-xl font-medium">{{ t('services.viewDetail') }}</p>
              <Icon name="mdi:chevron-right" class="size-4 xl:size-5 text-red-100" />
            </div>
          </div>
        </NuxtLink>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="text-gray-400 text-6xl mb-6">🏢</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ t('services.noServicesFound') }}</h3>
        <p class="text-gray-500 mb-8 text-base">
          {{ t('services.noServicesAvailable') }}
        </p>
      </div>
      
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
    </div>
  </div>
</template>
