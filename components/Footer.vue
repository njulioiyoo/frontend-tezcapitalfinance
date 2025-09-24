<script setup>
// Get configuration data and i18n
const { t, locale } = useI18n()
const { initConfiguration, socialMedia: configSocialMedia, ojkTitle, ojkDescription, ojkImages } = useConfiguration()
const apiStore = useApiStore()

// Services data
const services = ref([])

// Fetch services data
const fetchServices = async () => {
  try {
    const response = await apiStore.fetchServices()
    // Handle paginated response structure
    if (response.data && response.data.data) {
      services.value = response.data.data || []
    } else if (response.data) {
      services.value = response.data || []
    } else {
      services.value = []
    }
  } catch (error) {
    console.error('Failed to fetch services:', error)
    services.value = []
  }
}

// Initialize configuration on component mount
onMounted(async () => {
  await initConfiguration()
  await fetchServices()
})

// Dynamic menu structure matching Header.vue
const linkMenu = computed(() => [
  {
    title: t('nav.aboutUs'),
    menu: [
      {
        label: t('nav.about.ourStory'),
        link: "/about",
      },
      {
        label: t('nav.about.logoPhilosophy'),
        link: "/about",
      },
    ],
  },
  {
    title: t('nav.services'),
    menu: [
      ...(Array.isArray(services.value) ? services.value.map(service => ({
        label: locale.value === 'en' ? (service.title_en || service.title_id || 'Untitled Service') : (service.title_id || service.title_en || 'Untitled Service'),
        link: `/service/${service.slug || service.id}`
      })) : []),
      {
        label: t('nav.service.faq'),
        link: "/contact",
      },
    ],
  },
  {
    title: t('nav.newsEvent'),
    menu: [
      {
        label: t('nav.news.bisnis'),
        link: "/news",
      },
      {
        label: t('nav.news.companyActivities'),
        link: "/news",
      },
      {
        label: t('nav.news.pressRelease'),
        link: "/news",
      },
      {
        label: t('nav.news.highlights'),
        link: "/news",
      },
    ],
  },
  {
    title: t('nav.corporate'),
    menu: [
      {
        label: t('nav.corporateMenu.financialReport'),
        link: "/corporate",
      },
      {
        label: t('nav.corporateMenu.annualReport'),
        link: "/corporate",
      },
      {
        label: t('nav.corporateMenu.announcement'),
        link: "/corporate",
      },
    ],
  },
]);

// OJK images are now managed through configuration
// Remove hardcoded verified array - using ojkImages from useConfiguration instead

// Map platform names to icons
const platformIcons = {
  facebook: "uil:facebook",
  linkedin: "uil:linkedin", 
  youtube: "uil:youtube",
  instagram: "uil:instagram",
  twitter: "uil:twitter",
  tiktok: "uil:tiktok",
  whatsapp: "uil:whatsapp",
}

// Computed social media data - only from API, no fallbacks
const socialMedia = computed(() => {
  
  if (configSocialMedia.value && configSocialMedia.value.length > 0) {
    const mapped = configSocialMedia.value.map(item => ({
      platform: item.platform,
      url: item.url,
      icon: item.icon || platformIcons[item.platform.toLowerCase()] || "uil:link"
    }))
    return mapped
  }
  return []
})
</script>

<template>
  <footer
    class="bg-grey py-10 px-3 sm:px-4 md:px-6 xl:px-20 flex flex-col gap-12"
  >
    <div class="grid grid-cols-2 xl:grid-cols-5 gap-12">
      <span class="col-span-2 xl:col-span-1">
        <img
          src="/img/logo.png"
          alt="TEX Capital & Finance"
          class="self-center mx-auto"
        />
      </span>
      <div
        class="flex flex-col gap-1"
        v-for="(i, index) in linkMenu"
        :key="index"
      >
        <h6 class="font-bold text-red-100 text-base xl:text-lg">
          {{ i.title }}
        </h6>
        <ul class="flex flex-col gap-1">
          <li
            class="text-black-50 group"
            v-for="(item, index) in i.menu"
            :key="index"
          >
            <NuxtLink
              class="group-hover:underline text-sm xl:text-base"
              :to="item.link"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-12">
      <div class="flex gap-3 justify-center items-center order-3 xl:order-1">
        <img
          v-for="(ojkImg, index) in ojkImages"
          :key="index"
          :src="ojkImg.url"
          :alt="ojkImg.alt"
          class="w-18 xl:w-20 h-10 object-contain"
        />
      </div>
      <div class="flex flex-col items-center order-2">
        <p class="text-black-50 font-bold text-center text-sm xl:text-base">
          {{ ojkTitle }}
        </p>
        <p class="text-sm text-black-50 text-center">
          {{ ojkDescription }}
        </p>
      </div>
      <div class="flex gap-6 items-center justify-center order-1 xl:order-3">
        
        <NuxtLink 
          v-for="(item, index) in socialMedia" 
          :key="index" 
          :to="item.url" 
          :title="item.platform"
          target="_blank"
          rel="noopener noreferrer"
          v-if="socialMedia.length > 0"
        >
          <Icon :name="item.icon" class="text-divider size-5 xl:size-6" />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
