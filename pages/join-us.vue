<template>
  <div>
    <Jumbotron 
      label="Jadi Bagian Dari TEZ Capital" 
      img="/img/dummy1.jpg" 
    />

    <section class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-12 items-center">
          <!-- CEO Content -->
          <div>
            <h2 class="xl:text-5xl text-2xl font-bold text-black-100 mb-6 xl:mb-8">
              {{ joinUsStore.ceoMessage.title }}
            </h2>
            <div class="prose prose-gray max-w-none">
              <p class="text-divider leading-relaxed mb-4 text-base xl:text-lg">
                {{ joinUsStore.ceoMessage.content.split('\n\n')[0] }}
              </p>
              <p class="text-divider leading-relaxed text-base xl:text-lg">
                {{ joinUsStore.ceoMessage.content.split('\n\n')[1] }}
              </p>
            </div>
          </div>

          <div class="flex justify-center xl:justify-end">
            <div class="relative">
              <img 
                :src="joinUsStore.ceoMessage.image" 
                :alt="joinUsStore.ceoMessage.name"
                class="w-80 h-96 xl:w-96 xl:h-120 object-cover rounded-2xl shadow-sm"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-8 xl:py-12 bg-grey">
      <div class="px-3 xl:px-15">
        <div class="text-center mb-6 xl:mb-12">
          <h2 class="xl:text-5xl text-2xl font-bold text-black-100 mb-6 xl:mb-8">
            Get to Know Our Work
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 mb-8 xl:mb-12">
          <WorkSectionCard 
            v-for="section in joinUsStore.workSections"
            :key="section.id"
            :section="section"
          />
        </div>

        <div class="text-center">
          <NuxtLink
            to="/service"
            class="rounded-full mx-auto w-fit py-3 px-8 xl:px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 transition-all duration-300 cursor-pointer font-bold text-white text-lg xl:text-xl uppercase"
          >
            GO TO SERVICES
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <div class="text-center mb-6 xl:mb-12">
          <h2 class="xl:text-5xl text-2xl font-bold text-black-100">
            Meet Our People
          </h2>
        </div>

        <div class="relative">
          <button 
            @click="scrollTeamLeft"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': !canScrollLeft }"
          >
            <Icon name="mdi:chevron-left" class="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            @click="scrollTeamRight"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': !canScrollRight }"
          >
            <Icon name="mdi:chevron-right" class="w-6 h-6 text-gray-600" />
          </button>

          <div 
            ref="teamContainer"
            class="flex gap-6 overflow-x-auto no-scrollbar px-12"
            @scroll="updateScrollState"
          >
            <div 
              v-for="member in joinUsStore.teamMembers"
              :key="member.id"
              class="flex-none w-64"
            >
              <TeamMemberCard :member="member" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-8 xl:py-12 bg-grey">
      <div class="px-3 xl:px-15">
        <div class="text-center mb-6 xl:mb-12">
          <h2 class="xl:text-5xl text-2xl font-bold text-black-100">
            Explore Our Workplace
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12">
          <WorkplaceCard 
            v-for="section in joinUsStore.workplaceSections"
            :key="section.id"
            :section="section"
          />
        </div>
      </div>

       <div class="text-center mt-8 xl:mt-14">
          <h2 class="xl:text-5xl text-2xl font-bold text-black-100 mb-6 xl:mb-8">
            Be a Part of Our Team
          </h2>
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
    </section>
    <section class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-60">
        <div v-if="displayedJobs.length > 0" class="w-full">
          <NuxtLink
            v-for="(job, index) in displayedJobs"
            :key="job.id"
            :to="`/detail-job/${job.id}`"
            :class="[
              'grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6 py-4 px-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer',
              index !== displayedJobs.length - 1 ? 'border-b-2 border-gray-400' : ''
            ]"
          >
            <div class="xl:col-span-1">
              <div class="mb-2">
                <span class="text-red-600 font-medium text-s">
                  {{ job.category }}
                </span>
              </div>
              <h3 class="font-semibold text-gray-900 text-base">{{ job.title }}</h3>
              <div class="xl:hidden text-s text-gray-500 mt-8 space-y-1">
                <div><span class="font-medium">Departemen:</span> {{ job.department }}</div>
                <div><span class="font-medium">Lokasi:</span> {{ job.location }}</div>
              </div>
            </div>
            
            <div class="hidden xl:block text-left pl-8">
              <div class="text-s text-gray-400 tracking-wide mb-2">Departemen</div>
              <div class="text-gray-900 font-semibold text-base">{{ job.department }}</div>
            </div>
            
            <div class="hidden xl:block text-left pl-12 pr-8">
              <div class="text-s text-gray-400 tracking-wide mb-2">Lokasi</div>
              <div class="text-gray-900 font-semibold text-base">{{ job.location }}</div>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="py-12 text-center">
          <Icon name="mdi:briefcase-search" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada lowongan ditemukan</h3>
          <p class="text-gray-500">Coba ubah filter pencarian Anda</p>
        </div>

        <div class="text-center mt-8">
          <NuxtLink 
            to="/join-us/careers"
            class="rounded-full py-3 px-8 xl:px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 text-white font-bold text-lg xl:text-xl transition-all duration-300 cursor-pointer inline-block"
          >
            See All Job
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const joinUsStore = useJoinUsStore()
const jobsStore = useJobsStore()

const teamContainer = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const displayedJobs = computed(() => {
  return jobsStore.filteredJobs.slice(0, 6)
})

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

const scrollTeamLeft = () => {
  if (teamContainer.value) {
    teamContainer.value.scrollBy({ left: -280, behavior: 'smooth' })
  }
}

const scrollTeamRight = () => {
  if (teamContainer.value) {
    teamContainer.value.scrollBy({ left: 280, behavior: 'smooth' })
  }
}

const updateScrollState = () => {
  if (teamContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = teamContainer.value
    canScrollLeft.value = scrollLeft > 0
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
  }
}

onMounted(() => {
  nextTick(() => {
    updateScrollState()
  })
})

// SEO-nya
useHead({
  title: 'Join Us - TEZ Capital Finance',
  meta: [
    { name: 'description', content: 'Bergabunglah dengan tim TEZ Capital Finance dan kembangkan karir Anda bersama kami. Temukan peluang karir terbaik di bidang pembiayaan.' }
  ]
})

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/img/placeholder-ceo.jpg'
}

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