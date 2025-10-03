<script setup lang="ts">
const { t, locale } = useI18n()

// Page metadata
useSeoMeta({
  title: 'Join Us - TEZ Capital & Finance',
  description: 'Join our team at TEZ Capital & Finance. Explore career opportunities and be part of our growing company.',
})

// Hardcoded data for the page
const heroData = {
  title: "Bagian dari TEZ Capital",
  backgroundImage: "/img/dummy1.jpg"
}

const ceoMessage = {
  title: "Pesan dari CEO",
  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a gravida metus. Pellentesque interdum tristique lacus, vitae ultrices sapien ultrices hendrerit. Quisque diam lorem, vestibulum nec risus sit amet, mollis dapibus nunc. Nunc pharetra eget odio quis facilisis. Maecenas blandit, magna vel commodo blandit, nibh purus hendrerit quam, nec interdum leo arcu ac ipsum.

Fusce ullamcorper ornare odio, id rutrum diam dignissim semper. Fusce nec massa at nunc vulputate feugiat et vitae lectus. Sed interdum hendrerit mi, sit amet tincidunt quam ultrices quis.`,
  image: "/img/profile/1.png"
}

const services = [
  {
    id: 1,
    icon: "/img/services/1.png",
    title: "Working Capital Financing",
    description: "Short-Term Funding that Supports Business Sustainability and Expansion"
  },
  {
    id: 2,
    icon: "/img/services/2.png", 
    title: "Investment Financing",
    description: "Mid-Term Financing to Support Equipment Investment and Business Growth"
  },
  {
    id: 3,
    icon: "/img/services/3.png",
    title: "Multi-Purpose Financing", 
    description: "Supports financing for the purchase of products and services"
  }
]

const teamMembers = [
  {
    id: 1,
    name: "Arwin Rasyid",
    position: "Chairman & Founder",
    image: "/img/profile/1.png"
  },
  {
    id: 2,
    name: "Tonny Bako",
    position: "Komisaris Independen",
    image: "/img/profile/2.png"
  },
  {
    id: 3,
    name: "Shiro Sunaga",
    position: "Direktur Utama",
    image: "/img/profile/3.png"
  },
  {
    id: 4,
    name: "Yusuke Koizumi",
    position: "Direktur",
    image: "/img/profile/4.png"
  }
]

const workplaceHighlights = [
  {
    id: 1,
    title: "Working Environment",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
    image: "/img/dummy1.jpg"
  },
  {
    id: 2,
    title: "Employee Benefits", 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
    image: "/img/dummy2.jpg"
  },
  {
    id: 3,
    title: "Life at TEZ Capital",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
    image: "/img/dummy3.jpg"
  }
]

const jobListings = [
  {
    id: 1,
    category: "Procurement",
    title: "Procurement Supervisor",
    department: "Finance",
    location: "Jakarta"
  },
  {
    id: 2,
    category: "Talent Acquisition",
    title: "Senior Talent Acquisition",
    department: "People & Operation", 
    location: "Jakarta"
  },
  {
    id: 3,
    category: "Tax",
    title: "Transfer Pricing Assistant",
    department: "Finance",
    location: "Jakarta"
  },
  {
    id: 4,
    category: "Talent Acquisition",
    title: "Talent Acquisition Senior Manager",
    department: "People & Operation",
    location: "Jakarta"
  }
]

// Search and filter states
const searchQuery = ref("")
const selectedDepartment = ref("")
const selectedLocation = ref("")

const departments = ["All", "Finance", "People & Operation"]
const locations = ["All", "Jakarta"]

// Filtered jobs
const filteredJobs = computed(() => {
  return jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDepartment = !selectedDepartment.value || selectedDepartment.value === "All" || job.department === selectedDepartment.value
    const matchesLocation = !selectedLocation.value || selectedLocation.value === "All" || job.location === selectedLocation.value
    
    return matchesSearch && matchesDepartment && matchesLocation
  })
})

const getCategoryColor = (category: string) => {
  const colors = {
    'Procurement': 'text-red-100',
    'Talent Acquisition': 'text-red-100', 
    'Tax': 'text-red-100'
  }
  return colors[category] || 'text-red-100'
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div
      class="relative px-3 h-50 xl:h-100 flex flex-col items-center justify-center bg-red-100 overflow-hidden"
    >
      <img
        :src="heroData.backgroundImage"
        :alt="heroData.title"
        class="absolute inset-0 w-full h-full object-cover opacity-70 object-center"
      />
      <div class="absolute inset-0 bg-red-100/65 mix-blend-multiply"></div>
      <h1 class="relative z-10 text-white xl:text-5xl text-2xl font-bold text-center">
        {{ heroData.title }}
      </h1>
    </div>

    <!-- CEO Message Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-12 items-center">
        <div>
          <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-6">
            {{ ceoMessage.title }}
          </h2>
          <div class="text-black-100 text-base xl:text-lg leading-relaxed space-y-4">
            <p v-for="paragraph in ceoMessage.content.split('\n\n')" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
        <div class="flex justify-center xl:justify-end">
          <img
            :src="ceoMessage.image"
            alt="CEO"
            class="w-64 xl:w-80 h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Get to Know Our Work Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
        Get to Know Our Work
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 mb-8 xl:mb-12">
        <div
          v-for="service in services"
          :key="service.id"
          class="w-full max-w-100 mx-auto rounded-2xl p-3 flex flex-col gap-5 transition-all duration-300 select-none cursor-pointer bg-white hover:bg-red-50"
        >
          <img
            :src="service.icon"
            :alt="service.title"
            class="w-full h-25 xl:h-43 object-contain"
          />
          <div
            class="p-3 rounded-xl flex flex-col gap-2 items-center justify-center h-auto xl:h-35 bg-white/50"
          >
            <h3 class="text-red-100 text-center font-bold text-lg xl:text-xl">
              {{ service.title }}
            </h3>
            <p class="text-center text-sm xl:text-base text-red-100">
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <NuxtLink
          to="/service"
          class="py-3 px-8 rounded-full bg-red-100 hover:bg-red-75 transition-all duration-300 font-bold text-white text-lg xl:text-xl"
        >
          GO TO SERVICES
        </NuxtLink>
      </div>
    </div>

    <!-- Meet Our People Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
        Meet Our People
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        <div
          v-for="member in teamMembers"
          :key="member.id"
          class="flex flex-col items-center text-center"
        >
          <img
            :src="member.image"
            :alt="member.name"
            class="w-full max-w-xs h-60 xl:h-72 object-cover rounded-lg mb-4 mx-auto"
          />
          <h3 class="text-black-100 font-bold text-lg xl:text-xl">
            {{ member.name }}
          </h3>
          <p class="text-divider text-sm xl:text-base">
            {{ member.position }}
          </p>
        </div>
      </div>
    </div>

    <!-- Explore Our Workplace Section -->
    <div class="bg-grey px-3 xl:px-15 py-8 xl:py-12">
      <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
        Explore Our Workplace
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        <div
          v-for="(highlight, index) in workplaceHighlights"
          :key="highlight.id"
          class="flex flex-col overflow-hidden bg-white rounded-lg"
          :class="index === 2 ? 'border-2 border-blue-400' : 'shadow-sm'"
        >
          <img
            :src="highlight.image"
            :alt="highlight.title"
            class="w-full h-48 xl:h-56 object-cover"
          />
          <div class="p-4 xl:p-6 flex-1 flex flex-col">
            <h3 class="text-black-100 font-bold text-lg xl:text-xl mb-3 text-center">
              {{ highlight.title }}
            </h3>
            <p class="text-black-100 text-sm xl:text-base text-center leading-relaxed flex-1">
              {{ highlight.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Be a Part of Our Team Section -->
    <div class="bg-grey px-3 xl:px-15 py-8 xl:py-12">
      <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
        Be a Part of Our Team
      </h2>
      
      <!-- Search and Filters -->
      <div class="mb-8 xl:mb-12">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
          <!-- Search Input -->
          <div class="relative flex-1 w-full md:max-w-md">
            <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-divider size-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari Pekerjaan..."
              class="w-full pl-10 pr-4 py-3 border border-divider rounded-full focus:outline-none focus:border-red-100 text-base bg-white"
            />
          </div>
          
          <!-- Department Filter -->
          <div class="relative w-full md:w-auto">
            <select
              v-model="selectedDepartment"
              class="appearance-none bg-white border border-divider rounded-full px-6 py-3 pr-10 focus:outline-none focus:border-red-100 text-base cursor-pointer w-full md:w-auto min-w-48"
            >
              <option value="">Semua Departemen</option>
              <option v-for="dept in departments.slice(1)" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
            <Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-divider size-5 pointer-events-none" />
          </div>
          
          <!-- Location Filter -->
          <div class="relative w-full md:w-auto">
            <select
              v-model="selectedLocation"
              class="appearance-none bg-white border border-divider rounded-full px-6 py-3 pr-10 focus:outline-none focus:border-red-100 text-base cursor-pointer w-full md:w-auto min-w-48"
            >
              <option value="">Semua Lokasi</option>
              <option v-for="location in locations.slice(1)" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
            <Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-divider size-5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- Job Listings Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Job Listings Table -->
        <div class="mb-8 xl:mb-12">
          <!-- Job Rows -->
          <div class="space-y-0">
            <div
              v-for="job in filteredJobs"
              :key="job.id"
              class="border-b border-grey py-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
                <!-- Job Title Column -->
                <div class="flex flex-col">
                  <span class="text-sm font-medium mb-1" :class="getCategoryColor(job.category)">
                    {{ job.category }}
                  </span>
                  <h3 class="text-black-100 font-semibold text-base xl:text-lg">
                    {{ job.title }}
                  </h3>
                </div>
                
                <!-- Department Column -->
                <div class="flex flex-col">
                  <span class="text-divider text-sm font-medium mb-1">Departemen</span>
                  <span class="text-black-100 text-base xl:text-lg font-semibold">{{ job.department }}</span>
                </div>
                
                <!-- Location Column -->
                <div class="flex flex-col">
                  <span class="text-divider text-sm font-medium mb-1">Lokasi</span>
                  <span class="text-black-100 text-base xl:text-lg font-semibold">{{ job.location }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Results -->
          <div v-if="filteredJobs.length === 0" class="text-center py-8">
            <p class="text-divider text-lg">Tidak ada pekerjaan yang ditemukan</p>
          </div>
        </div>

        <!-- See All Jobs Button -->
        <div class="flex justify-center">
          <button
            class="py-3 px-8 rounded-full bg-red-100 hover:bg-red-75 transition-all duration-300 font-bold text-white text-lg xl:text-xl"
            @click="() => {}"
          >
            See All Job
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
