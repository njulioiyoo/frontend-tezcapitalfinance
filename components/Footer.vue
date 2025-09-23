<script setup>
// Get configuration data
const { initConfiguration, socialMedia: configSocialMedia } = useConfiguration()

// Initialize configuration on component mount
onMounted(async () => {
  await initConfiguration()
})

const linkMenu = [
  {
    title: "About Us",
    menu: [
      {
        label: "Our Story",
        link: "#",
      },
      {
        label: "Logo Philosophy",
        link: "#",
      },
      {
        label: "Management Profiles",
        link: "#",
      },
    ],
  },
  {
    title: "Services",
    menu: [
      {
        label: "Working Capital Financing",
        link: "#",
      },
      {
        label: "Investment Financing",
        link: "#",
      },
      {
        label: "Multi-Purpose Financing",
        link: "#",
      },
    ],
  },
  {
    title: "News & Event",
    menu: [
      {
        label: "Articles",
        link: "#",
      },
      {
        label: "Corporate Activity",
        link: "#",
      },
      {
        label: "Press Release",
        link: "#",
      },
      {
        label: "Highlights",
        link: "#",
      },
    ],
  },
  {
    title: "Corporate",
    menu: [
      {
        label: "Laporan Keuangan",
        link: "#",
      },
      {
        label: "Laporan Tahunan",
        link: "#",
      },
      {
        label: "Laporan Pengaduan",
        link: "#",
      },
      {
        label: "Announcement",
        link: "#",
      },
    ],
  },
];

const verified = [
  {
    img: "/img/ojk.png",
  },
  {
    img: "/img/ojk.png",
  },
  {
    img: "/img/ojk.png",
  },
  {
    img: "/img/ojk.png",
  },
];

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
          v-for="(i, index) in verified"
          :key="index"
          :src="i.img"
          alt="OJK"
          class="w-18 xl:w-20 h-10 object-contain"
        />
      </div>
      <div class="flex flex-col items-center order-2">
        <p class="text-black-50 font-bold text-center text-sm xl:text-base">
          Berizin dan Diawasi oleh Otoritas Jasa Keuangan
        </p>
        <p class="text-sm text-black-50 text-center">
          © 2025 PT TEZ Capital and Finance. All Rights Reserved
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
