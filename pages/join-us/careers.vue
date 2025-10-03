<template>
  <div>
    <Jumbotron 
      label="Jadi Bagian Dari TEZ Capital" 
      img="/img/dummy1.jpg" 
    />
    
    <section class="py-8 xl:py-12">
      <div class="px-3 xl:px-15">
        <div class="text-center mb-6 xl:mb-12">
          <h1 class="xl:text-5xl text-2xl font-bold text-black-100 mb-6 xl:mb-8">
            Be a Part of Our Team
          </h1>

          <div class="flex flex-col xl:flex-row gap-4 xl:gap-6 justify-center items-center max-w-6xl mx-auto">
            <div class="relative flex-1 max-w-md xl:max-w-lg">
              <Icon name="mdi:magnify" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-divider w-5 h-5" />
              <input
                :value="jobsStore.searchQuery"
                @input="handleSearchInput"
                type="text"
                placeholder="Cari Pekerjaan..."
                class="w-full pl-12 pr-4 py-4 border border-divider rounded-full bg-white focus:ring-2 focus:ring-red-100 focus:border-red-100 text-black-100 placeholder-divider transition-all duration-300"
              />
            </div>
            
            <div class="relative min-w-52 xl:min-w-60">
              <select
                :value="jobsStore.selectedDepartment"
                @change="handleDepartmentChange"
                class="appearance-none w-full px-6 py-4 border border-divider rounded-full bg-white focus:ring-2 focus:ring-red-100 focus:border-red-100 text-black-100 pr-10 transition-all duration-300"
              >
                <option value="all">Semua Departemen</option>
                <option 
                  v-for="dept in jobsStore.departments"
                  :key="dept.id"
                  :value="dept.name"
                >
                  {{ dept.name }}
                </option>
              </select>
              <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-divider w-5 h-5 pointer-events-none" />
            </div>

            <div class="relative min-w-52 xl:min-w-60">
              <select
                :value="jobsStore.selectedLocation"
                @change="handleLocationChange"
                class="appearance-none w-full px-6 py-4 border border-divider rounded-full bg-white focus:ring-2 focus:ring-red-100 focus:border-red-100 text-black-100 pr-10 transition-all duration-300"
              >
                <option value="all">Semua Lokasi</option>
                <option 
                  v-for="loc in jobsStore.locations"
                  :key="loc.id"
                  :value="loc.name"
                >
                  {{ loc.name }}
                </option>
              </select>
              <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-divider w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-6 xl:mb-8">
          <p class="text-divider text-base xl:text-lg">
            Menampilkan {{ jobsStore.filteredJobs.length }} lowongan
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-grey overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 xl:gap-6 p-4 xl:p-6 bg-grey border-b border-divider font-bold text-black-100">
            <div>Posisi</div>
            <div class="hidden xl:block">Kategori</div>
            <div class="hidden xl:block">Departemen</div>
            <div class="hidden xl:block">Lokasi</div>
          </div>

            <div v-if="jobsStore.filteredJobs.length > 0">
              <NuxtLink 
                v-for="job in jobsStore.filteredJobs"
                :key="job.id"
                :to="`/detail-job/${job.id}`"
                class="grid grid-cols-1 xl:grid-cols-4 gap-4 xl:gap-6 p-4 xl:p-6 border-b border-grey hover:bg-grey transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <h3 class="font-bold text-black-100 text-lg xl:text-xl group-hover:text-red-100 transition-colors duration-300">
                    {{ job.title }}
                  </h3>
                  <div class="xl:hidden mt-3 space-y-2 text-sm text-divider">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-black-100">Kategori:</span> 
                      <span 
                        class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                        :class="getCategoryClass(job.category)"
                      >
                        {{ job.category }}
                      </span>
                    </div>
                    <div><span class="font-medium text-black-100">Departemen:</span> {{ job.department }}</div>
                    <div><span class="font-medium text-black-100">Lokasi:</span> {{ job.location }}</div>
                  </div>
                </div>
                
                <div class="hidden xl:flex items-center">
                  <span 
                    class="inline-block px-3 py-2 text-sm font-medium rounded-full"
                    :class="getCategoryClass(job.category)"
                  >
                    {{ job.category }}
                  </span>
                </div>
                
                <div class="hidden xl:flex items-center text-divider font-medium">
                  {{ job.department }}
                </div>
                
                <div class="hidden xl:flex items-center text-divider font-medium">
                  {{ job.location }}
                </div>
              </NuxtLink>
            </div>

            <div v-else class="py-12 xl:py-20 text-center">
              <Icon name="mdi:briefcase-search" class="w-16 h-16 xl:w-20 xl:h-20 text-divider mx-auto mb-4 xl:mb-6" />
              <h3 class="text-lg xl:text-2xl font-bold text-black-100 mb-2 xl:mb-3">
                Tidak ada lowongan ditemukan
              </h3>
              <p class="text-divider text-base xl:text-lg">
                Coba ubah filter pencarian Anda
              </p>
            </div>
          </div>

        <div class="text-center mt-8 xl:mt-12 flex flex-col xl:flex-row gap-4 xl:gap-6 justify-center items-center">
          <NuxtLink
            to="/join-us"
            class="rounded-full py-3 px-8 xl:px-12 bg-black-50 hover:bg-divider text-white font-bold text-lg xl:text-xl transition-all duration-300 cursor-pointer min-w-fit"
          >
            Kembali ke Join Us
          </NuxtLink>
          <a
            href="#"
            class="rounded-full py-3 px-8 xl:px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 text-white font-bold text-lg xl:text-xl transition-all duration-300 cursor-pointer min-w-fit"
          >
            Apply Now
          </a>
        </div>
      </div>
      </section>
  </div>
</template>

<script setup lang="ts">
const jobsStore = useJobsStore()

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    jobsStore.setSearchQuery(target.value)
  }
}

const handleDepartmentChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target) {
    jobsStore.setDepartmentFilter(target.value)
  }
}

const handleLocationChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target) {
    jobsStore.setLocationFilter(target.value)
  }
}

useHead({
  title: 'Careers - TEZ Capital Finance',
  meta: [
    { name: 'description', content: 'Temukan peluang karir terbaik di TEZ Capital Finance. Bergabunglah dengan tim profesional kami dan kembangkan karir Anda.' }
  ]
})

const getCategoryClass = (category: string) => {
  const cat = category.toLowerCase()
  
  if (cat.includes('procurement')) {
    return 'bg-red-100 text-red-800'
  } else if (cat.includes('talent')) {
    return 'bg-blue-100 text-blue-800'
  } else if (cat.includes('tax')) {
    return 'bg-purple-100 text-purple-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}
</script>