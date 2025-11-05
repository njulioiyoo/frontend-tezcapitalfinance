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

// Employee benefits items state
const employeeBenefitsItems = ref<any[]>([])

// Extract workplace configurations from configData
const extractWorkplaceConfigs = () => {
  if (configData.value) {
    const workplaceData = configData.value.join_us?.workplace || {}
    workplaceConfigs.value = workplaceData
    
    // Extract employee benefits items
    const benefitsData = configData.value.join_us?.employee_benefits_items
    
    if (benefitsData) {
      try {
        employeeBenefitsItems.value = Array.isArray(benefitsData) ? benefitsData : JSON.parse(benefitsData)
      } catch (e) {
        employeeBenefitsItems.value = []
      }
    }
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


// Function to organize items within a category into rows
const organizeItemsIntoRows = (items: any[]) => {
  const totalItems = items.length
  
  if (totalItems <= 3) {
    // If 3 or fewer items, put all in one row
    return [items]
  } else if (totalItems === 4) {
    // If 4 items: row1: [1,2]; row2: [3,4]
    return [
      items.slice(0, 2),
      items.slice(2, 4)
    ]
  } else if (totalItems === 5) {
    // If 5 items: row1: [1,2,3]; row2: [4,5]
    return [
      items.slice(0, 3),
      items.slice(3, 5)
    ]
  } else {
    // For more than 5 items, group in rows of max 3
    const rows = []
    for (let i = 0; i < totalItems; i += 3) {
      rows.push(items.slice(i, i + 3))
    }
    return rows
  }
}

// Function to get grid columns class based on number of items in row
const getGridCols = (itemsInRow: number) => {
  switch (itemsInRow) {
    case 1: return 'grid-cols-1'
    case 2: return 'grid-cols-1 md:grid-cols-2'
    case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
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
    <!-- Banner -->
    <div v-if="pending" class="relative h-64 bg-gray-200 animate-pulse">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="bg-gray-300 h-8 w-64 mx-auto mb-4 rounded"></div>
          <div class="bg-gray-300 h-4 w-96 mx-auto rounded"></div>
        </div>
      </div>
    </div>
    <Jumbotron v-else :label="bannerTitle" :desc="bannerDescription" :img="bannerImage" />
    
    <!-- Main Content -->
    <section class="py-8 xl:py-12 bg-white">
      <!-- Loading State -->
      <div v-if="pending" class="px-3 xl:px-15">
        <div class="max-w-4xl mx-auto">
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

      <!-- Content State -->
      <div v-else class="px-3 xl:px-15">
        <!-- Back Button -->
        <NuxtLink
          to="/join-us"
          class="flex items-center gap-2 text-base text-red-100 mb-6 hover:text-red-50 transition-colors duration-200"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          {{ t('joinUs.detail.back') }}
        </NuxtLink>
        
        <div class="max-w-6xl mx-auto">
          
          <!-- Main Title and Description -->
          <div class="text-center mb-12">
            <h1 class="xl:text-4xl text-2xl text-black-100 font-bold mb-6">
              {{ getEmployeeBenefitsTitle() }}
            </h1>
            <p class="text-base text-black-100 leading-relaxed max-w-4xl mx-auto mb-8">
              {{ getEmployeeBenefitsDescription() }}
            </p>
          </div>
          
          <!-- Separator Line - Banner Width -->
          <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12 shadow-sm"></div>
            
          <!-- Employee Benefits Categories -->
          <div v-if="employeeBenefitsItems.length > 0" class="space-y-16">
            <div v-for="(category, categoryIndex) in employeeBenefitsItems" :key="categoryIndex">
                <!-- Category Title -->
                <div class="text-center mb-8">
                  <h3 class="text-2xl font-bold text-black-100">
                    {{ locale === 'id' ? category.category_title_id : category.category_title_en }}
                  </h3>
                </div>
                
                <!-- Category Items -->
                <div v-if="category.items && category.items.length > 0" class="space-y-8">
                  <div 
                    v-for="(row, rowIndex) in organizeItemsIntoRows(category.items)" 
                    :key="rowIndex"
                    :class="['grid gap-6', getGridCols(row.length)]"
                  >
                    <div 
                      v-for="(item, itemIndex) in row" 
                      :key="itemIndex"
                      class="employee-benefits-card"
                    >
                      <!-- Item Title (Top) -->
                      <h4 class="text-lg font-bold text-black-100 mb-6">
                        {{ locale === 'id' ? item.title_id : item.title_en }}
                      </h4>
                      
                      <!-- Item Icon + Percentage (Center, Horizontal) -->
                      <div class="mb-6 flex justify-center items-center gap-4">
                        <!-- Icon -->
                        <div v-if="item.icon" class="w-16 h-16 flex items-center justify-center employee-benefits-icon">
                          <img 
                            :src="item.icon.startsWith('http') ? item.icon : `/storage/${item.icon}`" 
                            :alt="locale === 'id' ? item.title_id : item.title_en"
                            class="w-full h-full object-contain"
                            style="filter: hue-rotate(330deg) saturate(2) brightness(0.8);"
                            @error="$event.target.style.display='none'"
                          />
                        </div>
                        <div v-else class="w-16 h-16 flex items-center justify-center employee-benefits-icon">
                          <Icon name="mdi:gift" class="w-12 h-12" />
                        </div>
                        
                        <!-- Value (if exists, next to icon) -->
                        <div v-if="item.value && item.value_type" class="flex items-baseline">
                          <span class="employee-benefits-value">{{ item.value }}</span>
                          <span class="employee-benefits-type">{{ item.value_type }}</span>
                        </div>
                        <div v-else-if="item.percentage">
                          <span class="employee-benefits-percentage">{{ item.percentage }}</span>
                        </div>
                      </div>
                      
                      <!-- Item Description (Bottom) -->
                      <p class="text-sm text-gray-600 leading-relaxed">
                        {{ locale === 'id' ? item.description_id : item.description_en }}
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
            
          <!-- Fallback if no benefits data -->
          <div v-else class="text-center py-12">
            <p class="text-gray-500">Employee benefits information will be available soon.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>