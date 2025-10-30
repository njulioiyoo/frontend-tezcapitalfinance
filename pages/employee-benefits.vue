<script setup lang="ts">
// Protect this page with middleware
definePageMeta({
  middleware: 'join-us-guard'
})

const { t, locale } = useI18n()

// Use configuration composable to get workplace data
const { configData, fetchConfiguration, isLoading: configLoading } = useConfiguration()

// Banner data
const bannerData = ref({})

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
  if (!bannerData.value || Object.keys(bannerData.value).length === 0) {
    return t('joinUs.lowonganKerja')
  }
  
  const titleField = locale.value === 'id' 
    ? (bannerData.value as any).banner_join_us_title_id 
    : (bannerData.value as any).banner_join_us_title_en
  
  const defaultTitle = t('joinUs.lowonganKerja')
  return extractConfigValue(titleField) || defaultTitle
})

const bannerDescription = computed(() => {
  if (!bannerData.value || Object.keys(bannerData.value).length === 0) {
    return ''
  }
  
  const descField = locale.value === 'id' 
    ? (bannerData.value as any).banner_join_us_description_id 
    : (bannerData.value as any).banner_join_us_description_en
  
  return extractConfigValue(descField) || ''
})

const bannerImage = computed(() => {
  if (!bannerData.value || Object.keys(bannerData.value).length === 0) {
    return '/img/dummy1.jpg'
  }
  
  return extractConfigValue((bannerData.value as any).banner_join_us_image) || '/img/dummy1.jpg'
})

// Workplace configurations state
const workplaceConfigs = ref<any>({})

// Extract workplace configurations from configData
const extractWorkplaceConfigs = () => {
  if (configData.value) {
    const workplaceData = configData.value.join_us?.workplace || {}
    workplaceConfigs.value = workplaceData
  }
}

// Watch for changes in configData
watch(configData, (newData) => {
  if (newData) {
    extractWorkplaceConfigs()
  }
}, { immediate: true })

// Helper functions to get workplace data
const getEmployeeBenefitsTitle = () => {
  const key = `workplace_employee_benefits_title_${locale.value}`
  return workplaceConfigs.value[key] || 'Employee Benefits'
}

const getEmployeeBenefitsDescription = () => {
  const key = `workplace_employee_benefits_description_${locale.value}`
  return workplaceConfigs.value[key] || ''
}

// Loading state
const pending = ref(true)

// Initialize data on mount
onMounted(async () => {
  await Promise.all([
    fetchConfiguration(),
    fetchBannerData()
  ])
  extractWorkplaceConfigs()
  pending.value = false
})

// Page metadata
useSeoMeta({
  title: 'Employee Benefits - TEZ Capital & Finance',
  description: 'Discover the comprehensive benefits and facilities provided to TEZ Capital & Finance employees.',
})
</script>

<template>
  <div>
    <!-- Banner Loading State -->
    <div v-if="pending" class="relative h-64 bg-gray-200 animate-pulse">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="bg-gray-300 h-8 w-64 mx-auto mb-4 rounded"></div>
          <div class="bg-gray-300 h-4 w-96 mx-auto rounded"></div>
        </div>
      </div>
    </div>
    
    <!-- Banner Content -->
    <Jumbotron v-else :label="bannerTitle" :desc="bannerDescription" :img="bannerImage" />
    
    <!-- Loading State -->
    <div v-if="pending" class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <div class="max-w-4xl mx-auto">
          <!-- Loading Skeleton -->
          <div class="animate-pulse">
            <div class="bg-gray-200 h-6 w-20 mb-6 rounded"></div>
            <div class="mb-8 pb-6 border-b border-grey">
              <div class="bg-gray-200 h-10 w-3/4 mx-auto rounded"></div>
            </div>
            <div class="space-y-8">
              <div v-for="n in 4" :key="n">
                <div class="bg-gray-200 h-6 w-48 mb-4 rounded"></div>
                <div class="space-y-2">
                  <div class="bg-gray-200 h-4 w-full rounded"></div>
                  <div class="bg-gray-200 h-4 w-5/6 rounded"></div>
                  <div class="bg-gray-200 h-4 w-4/6 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content State -->
    <section v-else class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <!-- Back Button -->
        <NuxtLink
          to="/join-us"
          class="flex items-center gap-2 text-base text-red-100 mb-6 hover:text-red-50 transition-colors duration-200"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          {{ t('joinUs.detail.back') }}
        </NuxtLink>
        
        <div class="max-w-4xl mx-auto">
          
          <!-- Page Title -->
          <div class="mb-8 pb-6 border-b border-grey">
            <h1 class="xl:text-4xl text-2xl text-black-100 font-bold text-center">
              {{ getEmployeeBenefitsTitle() }}
            </h1>
          </div>
          
          <!-- Content Sections -->
          <div class="space-y-8">
            <!-- Employee Benefits Description -->
            <div>
              <div class="text-base text-black-100 leading-relaxed whitespace-pre-line">
                {{ getEmployeeBenefitsDescription() }}
              </div>
            </div>
            
            <!-- About TEZ Capital -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">About TEZ Capital</h2>
              <p class="text-base text-black-100 leading-relaxed">
                TEZ Capital & Finance is a leading financing company committed to providing the best financial solutions for our business partners. With a focus on innovation, integrity, and excellent service, we continue to grow and look for the best talent to join our growth journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>