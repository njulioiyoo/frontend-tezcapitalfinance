<script setup lang="ts">
import { nextTick } from 'vue'
const { t, locale } = useI18n()
const apiStore = useApiStore()

// Banner data
const bannerData = ref({})

// Loading state
const isLoading = ref(true)
const error = ref(null)

// API Data
const aboutData = ref({})

const anchor = computed(() => [
  {
    label: t('about.ourStory'),
    link: "#our-story",
  },
  {
    label: t('about.logoPhilosophy'),
    link: "#logo-philosophy",
  },
])

// Data from API only
const dataFast = computed(() => {
  const items = aboutData.value.fast_values?.items || []
  return items
})
const dataIdc = computed(() => {
  const items = aboutData.value.idc_values?.items || []
  return items
})

const scrollToSection = (id: string) => {
  const el = document.querySelector(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: y, behavior: "smooth" })
  }
}

// Fetch data from API
const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null
    const aboutResponse = await apiStore.fetchAbout()
    aboutData.value = aboutResponse
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => {
  fetchData()
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
    ? bannerData.value.banner_about_title_id 
    : bannerData.value.banner_about_title_en
  
  const defaultTitle = t('about.tentangKami')
  return extractConfigValue(titleField) || defaultTitle
})

const bannerDescription = computed(() => {
  const descField = locale.value === 'id' 
    ? bannerData.value.banner_about_description_id 
    : bannerData.value.banner_about_description_en
  
  return extractConfigValue(descField) || ''
})

const bannerImage = computed(() => {
  return extractConfigValue(bannerData.value.banner_about_image) || '/img/dummy1.jpg'
})

onMounted(() => {
  fetchBannerData()
  fetchData()
  
  // Handle hash navigation on page load
  nextTick(() => {
    if (process.client && window.location.hash) {
      const hash = window.location.hash
      setTimeout(() => {
        scrollToSection(hash)
      }, 500) // Wait for content to load
    }
  })
})

// Watch for language changes and refetch data
watch(() => locale.value, () => {
  fetchBannerData()
  fetchData()
}, { immediate: false })

// Watch for route changes to handle hash navigation
const route = useRoute()
watch(() => route.hash, (newHash) => {
  if (newHash && process.client) {
    nextTick(() => {
      setTimeout(() => {
        scrollToSection(newHash)
      }, 300)
    })
  }
}, { immediate: true })

</script>

<template>
  <div>
    <Jumbotron :label="bannerTitle" :desc="bannerDescription" :img="bannerImage" />
    
    <!-- Loading State -->
    <AboutPageSkeleton v-if="isLoading" />
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      :title="t('error.loadDataFailed')"
      :message="t('error.aboutPageLoadError')"
      @retry="retryFetch"
    />
    
    <!-- Content State -->
    <div v-else>
      <!-- Navigation Anchor Section -->
      <div class="lg:flex items-center justify-around border-b border-b-red-100 hidden">
        <div
          @click="scrollToSection(i.link)"
          class="py-9 uppercase cursor-pointer relative group"
          v-for="(i, index) in anchor"
          :key="index"
        >
          {{ i.label }}
          <div
            class="absolute w-full rounded-t-sm h-1 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-0 left-0"
          ></div>
        </div>
      </div>

      <!-- Our Story Section -->
      <div
        class="grid grid-cols-1 xl:grid-cols-3 px-3 xl:px-15 py-8 xl:py-12 gap-6"
        id="our-story"
        v-if="aboutData.our_story"
      >
        <div class="col-span-2">
          <h3 class="text-black-100 font-bold text-2xl xl:text-4xl mb-5">
            {{ aboutData.our_story.title }}
          </h3>
          <p class="text-black-100 text-base xl:text-xl" v-html="aboutData.our_story.content">
          </p>
        </div>
        <img
          :src="aboutData.our_story.image"
          alt="Our Story"
          class="w-full h-77.5 object-cover object-center"
          v-if="aboutData.our_story.image"
        />
      </div>
      
      <!-- Our Story - No Data Alert -->
      <div v-else class="px-3 xl:px-15 py-8 xl:py-12">
        <NoDataAlert section="Our Story" />
      </div>

      <!-- Vision & Mission Section -->
      <div class="grid grid-cols-1 xl:grid-cols-2 px-3 xl:px-15 xl:py-12 py-8 gap-6 xl:gap-12" v-if="aboutData.vision || aboutData.mission">
        <!-- Vision -->
        <div v-if="aboutData.vision">
          <h3 class="text-black-100 text-2xl xl:text-4xl pb-5 mb-5 border-b border-b-black-100">
            {{ aboutData.vision.title }}
          </h3>
          <p class="text-black-100 text-base xl:text-xl" v-html="aboutData.vision.content"></p>
        </div>
        <div v-else>
          <NoDataAlert section="Visi" />
        </div>
        
        <!-- Mission -->
        <div v-if="aboutData.mission">
          <h3 class="text-black-100 text-2xl xl:text-4xl pb-5 mb-5 border-b border-b-black-100">
            {{ aboutData.mission.title }}
          </h3>
          <ul class="list-disc ps-6" v-if="aboutData.mission.items?.length">
            <li v-for="item in aboutData.mission.items" :key="item.text || item" class="text-black-100 text-base xl:text-xl">
              {{ item.text || item }}
            </li>
          </ul>
        </div>
        <div v-else>
          <NoDataAlert section="Misi" />
        </div>
      </div>
      
      <!-- Vision & Mission - No Data Alert -->
      <div v-else class="px-3 xl:px-15 py-8 xl:py-12">
        <NoDataAlert section="Visi & Misi" />
      </div>

      <!-- F.A.S.T & I.D.C Values Section -->
      <div class="bg-grey py-8 xl:py-15 px-3 xl:px-15" v-if="dataFast.length || dataIdc.length">
        <!-- F.A.S.T Values -->
        <div v-if="dataFast.length">
          <div class="flex flex-col mb-12">
            <p class="text-lg xl:text-xl text-black-100 text-center">
              {{ aboutData.fast_values?.title || 'Kami memenuhi kebutuhan keuangan anda dengan nilai-nilai' }}
            </p>
            <p class="text-lg xl:text-xl text-black-100 font-medium text-center">
              {{ aboutData.fast_values?.subtitle || '"F.A.S.T"—Flexible, Agile, Solution-oriented, Trustworthy—yang kokoh.' }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="(i, index) in dataFast"
              :key="index"
              class="flex flex-col gap-2 xl:gap-4"
            >
              <img
                :src="i.icon"
                :alt="i.title"
                class="xl:size-37.5 size-25 mx-auto"
              />
              <h6 class="text-lg xl:text-xl font-medium text-black-100 text-center">
                {{ i.title }}
              </h6>
              <p class="text-black-100 text-sm xl:text-base text-center">
                {{ i.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Divider -->
        <div class="xl:py-12 py-8" v-if="dataFast.length && dataIdc.length">
          <div class="bg-divider h-0.25 w-full"></div>
        </div>
        
        <!-- I.D.C Values -->
        <div v-if="dataIdc.length">
          <div class="flex flex-col mb-12">
            <p class="text-lg xl:text-xl text-black-100 text-center">
              {{ aboutData.idc_values?.title }}
            </p>
            <p class="text-lg xl:text-xl text-black-100 font-medium text-center" v-if="aboutData.idc_values?.subtitle">
              {{ aboutData.idc_values.subtitle }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(i, index) in dataIdc"
              :key="index"
              class="flex flex-col gap-2 xl:gap-4"
            >
              <img
                :src="i.icon"
                :alt="i.title"
                class="xl:size-37.5 size-25 mx-auto"
              />
              <h6 class="text-lg xl:text-xl font-medium text-black-100 text-center">
                {{ i.title }}
              </h6>
              <p class="text-black-100 text-sm xl:text-base text-center">
                {{ i.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- F.A.S.T & I.D.C Values - No Data Alert -->
      <div v-else class="bg-grey py-8 xl:py-15 px-3 xl:px-15">
        <NoDataAlert section="F.A.S.T & I.D.C Values" />
      </div>

      <!-- Logo Philosophy Section -->
      <div class="xl:py-12 py-8 px-3 xl:px-15" id="logo-philosophy" v-if="aboutData.logo_philosophy">
        <h3 class="text-black-100 font-bold text-2xl xl:text-4xl mb-6 xl:mb-9 text-center">
          {{ aboutData.logo_philosophy.title }}
        </h3>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-12">
          <img
            :src="aboutData.logo_philosophy.image"
            alt="TEZ Capital & Finance"
            class="w-full h-25 xl:h-50 object-contain"
            v-if="aboutData.logo_philosophy.image"
          />
          <ul class="list-disc flex flex-col divide-y divide-black-100 ps-6" v-if="aboutData.logo_philosophy.points?.length">
            <li v-for="point in aboutData.logo_philosophy.points" :key="point.text || point" class="font-medium text-black-100 text-lg xl:text-xl py-5">
              {{ point.text || point }}
            </li>
          </ul>
        </div>
        <div class="xl:py-12 py-8">
          <div class="bg-divider h-0.25 w-full px-3 xl:px-15"></div>
        </div>
        <p class="text-center text-sm xl:text-base" v-html="aboutData.logo_philosophy.description" v-if="aboutData.logo_philosophy.description">
        </p>
      </div>
      
      <!-- Logo Philosophy - No Data Alert -->
      <div v-else class="xl:py-12 py-8 px-3 xl:px-15">
        <NoDataAlert section="Logo Philosophy" />
      </div>

      <!-- Closing Statement Section -->
      <div class="xl:py-12 py-8 px-3 xl:px-15 text-center" v-if="aboutData.closing_statement">
        <p class="text-black-100 text-lg xl:text-xl font-medium" v-html="aboutData.closing_statement">
        </p>
      </div>
      
      <!-- Closing Statement - No Data Alert -->
      <div v-else class="xl:py-12 py-8 px-3 xl:px-15">
        <NoDataAlert section="Closing Statement" />
      </div>

    </div>
  </div>
</template>
