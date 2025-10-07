<script setup lang="ts">
import type { CareerDetailResponse } from '~/composables/useCareers'

const route = useRoute()
const slug = route.params.id as string
const { t, locale } = useI18n()

const { getCareerBySlug } = useCareers()
const { configData, careerApplicationEmail, fetchConfiguration, isLoading: configLoading } = useConfiguration()

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

// Use asyncData for proper SSR error handling
const { data: career, pending, error } = await useLazyAsyncData(
  `career-${slug}`,
  async () => {
    try {
      // Fetch configuration, banner data, and career detail in parallel
      await Promise.all([
        fetchConfiguration(),
        fetchBannerData()
      ])
      const careerResponse = await getCareerBySlug(slug)
      
      // If no career data, this will automatically throw 404 from API
      return careerResponse
    } catch (err: any) {
      // Log error for debugging
      console.error('Career fetch error:', err)
      
      // Throw 404 for any error (job not found, network issues, etc.)
      throw createError({
        statusCode: 404,
        statusMessage: 'Job not found'
      })
    }
  }
)

// Ensure configuration is loaded before showing content
const isConfigurationReady = computed(() => {
  return !configLoading.value && configData.value !== null
})

// If there's still an error after data fetch, throw 404
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job not found'
  })
}

// Reactive state for UI interactions
const isApplying = ref(false)
const showSuccessMessage = ref(false)




// Generate mailto link for job application
const generateMailtoLink = computed(() => {
  if (!career.value?.data || !careerApplicationEmail.value) {
    return '#'
  }

  const subject = `Lamaran Kerja - ${career.value.data.title_id}`
  const body = `Yth. HRD TEZ Capital Finance,

Saya tertarik untuk melamar posisi ${career.value.data.title_id} di departemen ${career.value.data.department_id}.

Berikut adalah informasi singkat mengenai diri saya:
- Nama: [Nama Lengkap]
- Email: [Email]
- Telepon: [Nomor Telepon]
- Pengalaman: [Pengalaman Kerja]

Saya telah melampirkan CV dan dokumen pendukung lainnya untuk pertimbangan Bapak/Ibu.

Terima kasih atas waktu dan perhatiannya.

Hormat saya,
[Nama Lengkap]`

  return `mailto:${careerApplicationEmail.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

// Handle apply action with loading state
const handleApplyClick = async () => {
  // Use the computed value instead of accessing configData directly
  const email = careerApplicationEmail.value
  
  if (!email) {
    alert(t('joinUs.detail.emailNotConfigured'))
    return
  }

  if (!generateMailtoLink.value || generateMailtoLink.value === '#') {
    return
  }

  try {
    isApplying.value = true
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Open email client
    window.location.href = generateMailtoLink.value
    
    // Show success message
    setTimeout(() => {
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }, 1000)
    
  } catch (error) {
    alert(t('joinUs.detail.emailClientError'))
  } finally {
    // Reset loading state after delay
    setTimeout(() => {
      isApplying.value = false
    }, 1500)
  }
}

// Remove debug watchers to prevent infinite loops

// Dynamic head based on career data
watchEffect(() => {
  if (career.value?.data) {
    const careerData = career.value.data
    useHead({
      title: `${careerData.title_id} - TEZ Capital Finance`,
      meta: [
        { 
          name: 'description', 
          content: `Detail lowongan pekerjaan ${careerData.title_id} di TEZ Capital Finance. Bergabunglah dengan tim profesional kami di departemen ${careerData.department_id}.` 
        }
      ]
    })
  }
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
    <section v-else-if="career?.data" class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <!-- Back Button - di pojok kiri atas -->
        <NuxtLink
          to="/join-us/careers"
          class="flex items-center gap-2 text-base text-red-100 mb-6 hover:text-red-50 transition-colors duration-200"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          {{ t('joinUs.detail.back') }}
        </NuxtLink>
        
        <div class="max-w-4xl mx-auto">
          
          <!-- Job Title -->
          <div class="mb-8 pb-6 border-b border-grey">
            <h1 class="xl:text-4xl text-2xl text-black-100 font-bold text-center">
              {{ career.data.title_id }}
            </h1>
          </div>
          <!-- Content Sections -->
          <div class="space-y-8">
            <!-- About the Role -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">{{ t('joinUs.detail.aboutTheRole') }}</h2>
              <div class="text-base text-black-100 leading-relaxed" v-html="career.data.content_id"></div>
            </div>
            
            <!-- What You Will Need -->
            <div v-if="career.data.requirements_id">
              <h2 class="text-xl font-bold text-black-100 mb-4">{{ t('joinUs.detail.whatYouWillNeed') }}</h2>
              <div class="text-base text-black-100 leading-relaxed" v-html="career.data.requirements_id"></div>
            </div>
            
            <!-- What We Offer -->
            <div v-if="career.data.benefits_id">
              <h2 class="text-xl font-bold text-black-100 mb-4">{{ t('joinUs.detail.whatWeOffer') }}</h2>
              <div class="text-base text-black-100 leading-relaxed" v-html="career.data.benefits_id"></div>
            </div>
            
            <!-- About the Team -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">{{ t('joinUs.detail.aboutTheTeam') }}</h2>
              <p class="text-base text-black-100 leading-relaxed">
                {{ t('joinUs.detail.aboutTheTeamDescription', { department: career.data.department_id }) }}
              </p>
            </div>
            
            <!-- About TEZ Capital -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">{{ t('joinUs.detail.aboutTezCapital') }}</h2>
              <p class="text-base text-black-100 leading-relaxed">
                {{ t('joinUs.detail.aboutTezCapitalDescription') }}
              </p>
            </div>
          </div>
          <!-- Footer Section -->
          <div class="mt-12 pt-8 border-t border-grey">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div>
                  <span class="text-sm text-divider font-medium">{{ t('joinUs.department') }}</span>
                  <p class="text-black-100 font-semibold">{{ career.data.department_id }}</p>
                </div>
                <div>
                  <span class="text-sm text-divider font-medium">{{ t('joinUs.location') }}</span>
                  <p class="text-black-100 font-semibold">{{ career.data.location_id }}</p>
                </div>
              </div>
              
              <button
                @click="handleApplyClick"
                :disabled="isApplying || !careerApplicationEmail"
                :title="!careerApplicationEmail ? t('joinUs.detail.emailNotConfigured') : `${t('joinUs.detail.applyTo')} ${careerApplicationEmail}`"
                :class="[
                  'relative overflow-hidden rounded-full py-3 px-8 font-bold text-white text-base w-full xl:w-auto transition-all duration-300 transform group',
                  isApplying 
                    ? 'bg-red-75 cursor-not-allowed scale-95' 
                    : 'bg-red-100 hover:bg-red-75 hover:scale-105 active:scale-95 hover:shadow-lg',
                  (!careerApplicationEmail) ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <!-- Loading overlay -->
                <div 
                  v-if="isApplying" 
                  class="absolute inset-0 bg-red-75 flex items-center justify-center"
                >
                  <div class="flex items-center gap-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span class="text-sm">{{ t('joinUs.detail.openingEmail') }}</span>
                  </div>
                </div>
                
                <!-- Default content -->
                <div :class="{ 'opacity-0': isApplying }">
                  <div class="flex items-center justify-center gap-2">
                    <Icon name="mdi:email-send" class="w-5 h-5" />
                    <span>{{ t('joinUs.detail.applyNow') }}</span>
                  </div>
                </div>
                
                <!-- Ripple effect -->
                <div 
                  v-if="!isApplying"
                  class="absolute inset-0 rounded-full opacity-0 bg-white transform scale-0 group-hover:scale-110 group-hover:opacity-10 group-active:scale-100 group-active:opacity-20 transition-all duration-300"
                ></div>
                
                <!-- Shine effect on hover -->
                <div 
                  v-if="!isApplying && careerApplicationEmail"
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div 
        v-if="showSuccessMessage"
        class="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-600">
          <div class="flex items-center gap-3">
            <Icon name="mdi:check-circle" class="w-6 h-6 text-green-100" />
            <div>
              <p class="font-semibold">{{ t('joinUs.detail.emailClientOpened') }}</p>
              <p class="text-sm text-green-100">{{ t('joinUs.detail.completeAndSend') }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>