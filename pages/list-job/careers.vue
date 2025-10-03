<template>
  <div>
    <Jumbotron 
      label="Cari Lowongan yang Sesuai Denganmu" 
      img="/img/dummy1.jpg" 
    />
    <section class="py-8 xl:pt-12 border-b-2 border-b-gray-400" style="box-shadow: 0 10px 0 0 rgba(156, 163, 175, 0.3);">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl xl:text-4xl font-bold text-black-100 mb-6">
            Be a Part of Our Team
          </h2>
          
          <div class="flex flex-col xl:flex-row gap-4 xl:gap-6 justify-center items-center max-w-6xl mx-auto">
            <div class="relative flex-1 max-w-md xl:max-w-lg">
              <Icon name="mdi:magnify" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-divider w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari Pekerjaan..."
                class="w-full pl-12 pr-4 py-4 border border-divider rounded-full bg-white focus:ring-2 focus:ring-red-100 focus:border-red-100 text-black-100 placeholder-divider transition-all duration-300"
              />
            </div>
            <div class="relative min-w-52 xl:min-w-60">
              <select
                v-model="selectedDepartment"
                class="appearance-none w-full px-6 py-4 border border-divider rounded-full bg-white focus:ring-2 focus:ring-red-100 focus:border-red-100 text-black-100 pr-10 transition-all duration-300"
              >
                <option value="">Semua Departemen</option>
                <option 
                  v-for="dept in departmentOptions"
                  :key="dept.value"
                  :value="dept.value"
                >
                  {{ dept.label }}
                </option>
              </select>
              <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-divider w-5 h-5 pointer-events-none" />
            </div>
            <div class="relative min-w-52 xl:min-w-60">
              <select
                v-model="selectedLocation"
                class="appearance-none w-full px-6 py-4 border border-divider rounded-full bg-white focus:ring-2 focus:ring-red-100 focus:border-red-100 text-black-100 pr-10 transition-all duration-300"
              >
                <option value="">Semua Lokasi</option>
                <option 
                  v-for="loc in locationOptions"
                  :key="loc.value"
                  :value="loc.value"
                >
                  {{ loc.label }}
                </option>
              </select>
              <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-divider w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-8 xl:py-10 bg-white">
      <div class="max-w-7xl mx-auto px-4">

        <div v-if="paginatedJobs.length > 0" class="bg-white">
          <JobCard 
            v-for="job in paginatedJobs"
            :key="job.id"
            :job="job"
          />
        </div>

        <div v-else class="text-center py-12">
          <Icon name="mdi:briefcase-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada lowongan ditemukan</h3>
          <p class="text-gray-600">Coba ubah filter pencarian Anda</p>
        </div>

        <div v-if="totalPages > 1" class="mt-8 flex justify-end">
          <nav class="flex items-center space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:text-red-100 hover:bg-red-50'
              ]"
            >
              <Icon name="mdi:chevron-left" class="w-5 h-5" />
            </button>

            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="typeof page === 'number' && goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  page === currentPage
                    ? 'bg-red-100 text-white'
                    : 'text-gray-700 hover:text-red-100 hover:bg-red-50'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-gray-500">...</span>
            </template>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:text-red-100 hover:bg-red-50'
              ]"
            >
              <Icon name="mdi:chevron-right" class="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const joinUsStore = useJoinUsStore()

useSeoMeta({
  title: 'Karir - TEZ Capital Finance',
  description: 'Temukan kesempatan karir terbaik di TEZ Capital Finance. Bergabunglah dengan tim kami dan kembangkan karir Anda di industri pembiayaan.',
})

const searchQuery = ref("")
const selectedDepartment = ref("")
const selectedLocation = ref("")
const currentPage = ref(1)
const itemsPerPage = 5

const { 
  jobPositions, 
  departmentOptions, 
  locationOptions 
} = joinUsStore

const filteredJobs = computed(() => {
  let filtered = [...jobPositions]

  if (searchQuery.value) {
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(job => job.department === selectedDepartment.value)
  }

  if (selectedLocation.value) {
    filtered = filtered.filter(job => job.location === selectedLocation.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredJobs.value.length / itemsPerPage)
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredJobs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    if (!pages.includes(total)) {
      pages.push(total)
    }
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch([searchQuery, selectedDepartment, selectedLocation], () => {
  currentPage.value = 1
})
</script>