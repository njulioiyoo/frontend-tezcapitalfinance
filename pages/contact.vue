<script setup lang="ts">
// Get configuration data and homepage data
const { t, locale } = useI18n()
const { initConfiguration, contactPhone, contactEmail, contactAddress, contactWhatsapp, appName } = useConfiguration()
const { initHomepage, services, faqItems, faqTitle } = useHomepage()

// Banner data
const bannerData = ref({})

// Local loading and error state
const isLoading = ref(true)
const error = ref(null)

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
    ? bannerData.value.banner_contact_title_id 
    : bannerData.value.banner_contact_title_en
  
  const defaultTitle = t('contact.contactUs')
  return extractConfigValue(titleField) || defaultTitle
})

const bannerDescription = computed(() => {
  const descField = locale.value === 'id' 
    ? bannerData.value.banner_contact_description_id 
    : bannerData.value.banner_contact_description_en
  
  return extractConfigValue(descField) || ''
})

const bannerImage = computed(() => {
  return extractConfigValue(bannerData.value.banner_contact_image) || '/img/dummy1.jpg'
})

// Fetch all data
const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Fetch configuration, homepage, and banner data in parallel
    await Promise.all([
      initConfiguration(),
      initHomepage(),
      fetchBannerData()
    ])
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// Watch for language changes and refetch data
watch(() => locale.value, () => {
  fetchData()
}, { immediate: false })


// Services and FAQ data will come from API via composables
</script>

<template>
  <div>
    <Jumbotron :label="bannerTitle" :desc="bannerDescription" :img="bannerImage" />
    
    <!-- Loading State -->
    <ContactPageSkeleton v-if="isLoading" />
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      title="Gagal Memuat Data Kontak"
      message="Terjadi kesalahan saat mengambil data kontak. Silakan coba lagi."
      @retry="fetchData"
    />
    
    <!-- Content State -->
    <div v-else>
      <div class="bg-grey px-3 xl:px-15 py-8 xl:py-12">
        <h1 class="text-2xl xl:text-4xl font-bold text-black-100 mb-6">
          {{ t('contact.headOffice') }}
        </h1>
        <div class="flex flex-col gap-4">
          <h3 v-if="appName" class="text-xl xl:text-2xl">{{ appName }}</h3>
          
          <!-- Address from API -->
          <p v-if="contactAddress" class="text-lg xl:text-xl">
            {{ contactAddress }}
          </p>
          
          <!-- Phone from API -->
          <a v-if="contactPhone" class="flex items-center gap-2" :href="`tel:${contactPhone.replace(/[^0-9+]/g, '')}`">
            <Icon name="mdi:phone" class="text-red-100 size-6" />
            <span class="text-lg xl:text-xl">{{ contactPhone }}</span>
          </a>
          
          <!-- Email from API -->
          <a v-if="contactEmail" class="flex items-center gap-2" :href="`mailto:${contactEmail}`">
            <Icon name="mdi:email" class="text-red-100 size-6" />
            <span class="text-lg xl:text-xl">{{ contactEmail }}</span>
          </a>
          
          <!-- WhatsApp from API (if available) -->
          <a v-if="extractConfigValue(contactWhatsapp) && extractConfigValue(contactWhatsapp).trim() !== ''" class="flex items-center gap-2" :href="`https://wa.me/${extractConfigValue(contactWhatsapp).replace(/[^0-9]/g, '')}`" target="_blank" rel="noopener noreferrer">
            <Icon name="mdi:whatsapp" class="text-red-100 size-6" />
            <span class="text-lg xl:text-xl">{{ extractConfigValue(contactWhatsapp) }}</span>
          </a>
        </div>
      </div>
      <div class="px-3 xl:px-15 py-8 xl:py-12 gap-6 xl:gap-12 flex flex-col">
        <div class="flex items-center gap-6 justify-center">
          <img src="/img/faq.png" alt="FAQ" class="w-30" />
          <h3 class="xl:text-5xl text-xl">
            {{ t('contact.findInfo') }}
          </h3>
        </div>
        <!-- Services Grid -->
        <div v-if="services.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            class="py-6 px-5 border border-divider hover:border-red-100 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center group cursor-pointer gap-6"
            v-for="(service, index) in services"
            :key="service.id"
          >
            <img
              :src="service.featured_image"
              :alt="service.title"
              class="contrast-0 group-hover:contrast-100 transition-all duration-300 size-25 object-contain"
            />
            <p
              class="text-xl text-divider group-hover:text-red-100 duration-300 transition-all text-center"
            >
              {{ service.title }}
            </p>
          </div>
        </div>
        
        <!-- No Services Alert -->
        <div v-else>
          <NoDataAlert section="Services" />
        </div>
        <!-- FAQ Accordion -->
        <Accordion type="single" class="w-full" collapsible v-if="faqItems.length > 0">
          <AccordionItem
            v-for="item in faqItems"
            :key="item.id"
            :value="`item-${item.id}`"
          >
            <AccordionTrigger>{{ item.question }}</AccordionTrigger>
            <AccordionContent>
              {{ item.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <!-- No FAQ Alert -->
        <div v-else>
          <NoDataAlert section="FAQ" />
        </div>
      </div>
    </div>
  </div>
</template>
