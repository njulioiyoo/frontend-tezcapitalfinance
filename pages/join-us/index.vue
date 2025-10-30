<script setup lang="ts">
// Protect this page with middleware
definePageMeta({
  middleware: 'join-us-guard'
})

const { t, locale } = useI18n()
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'

// Page metadata
useSeoMeta({
  title: 'Join Us - TEZ Capital & Finance',
  description: 'Join our team at TEZ Capital & Finance. Explore career opportunities and be part of our growing company.',
})

// Use join us data from configuration
const { joinUsData, loadJoinUsData } = useJoinUs()

// Use configuration composable
const { configData, fetchConfiguration, isLoading: configLoading } = useConfiguration()

// Workplace configurations state
const workplaceConfigs = ref<any>({})

// Extract workplace configurations from configData
const extractWorkplaceConfigs = () => {
  if (configData.value) {
    // Access workplace data directly from join_us.workplace
    const workplaceData = configData.value.join_us?.workplace || {}
    
    // Assign workplace configurations directly
    workplaceConfigs.value = workplaceData
  }
}

// Watch for changes in configData to extract workplace configs
watch(configData, (newData) => {
  if (newData) {
    extractWorkplaceConfigs()
  }
}, { immediate: true })

// Fetch workplace configurations (using existing configuration composable)
const fetchWorkplaceConfigs = async () => {
  await fetchConfiguration()
  extractWorkplaceConfigs()
}

// Helper functions to get workplace data
const getWorkplaceTitle = (type: 'working_environment' | 'employee_benefits') => {
  const key = `workplace_${type}_title_${locale.value}`
  return workplaceConfigs.value[key] || ''
}

const getWorkplaceDescription = (type: 'working_environment' | 'employee_benefits') => {
  const key = `workplace_${type}_description_${locale.value}`
  return workplaceConfigs.value[key] || ''
}

const getWorkplaceImage = (type: 'working_environment' | 'employee_benefits') => {
  const key = `workplace_${type}_image`
  return workplaceConfigs.value[key] || ''
}

const getWorkplaceSlug = (type: 'working_environment' | 'employee_benefits') => {
  const key = `workplace_${type}_slug`
  return workplaceConfigs.value[key] || ''
}

// Handle workplace card clicks
const handleWorkplaceCardClick = (type: 'working_environment' | 'employee_benefits') => {
  if (type === 'working_environment') {
    // Auto scroll to Working Environment slider section with offset
    const workingEnvironmentSection = document.querySelector('#working-environment-section')
    if (workingEnvironmentSection) {
      const elementPosition = workingEnvironmentSection.offsetTop
      const offsetPosition = elementPosition - 100 // 100px offset from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  } else if (type === 'employee_benefits') {
    // Navigate to Employee Benefits detail page
    const router = useRouter()
    router.push('/employee-benefits')
  }
}

// Use homepage data for services
const { 
  services,
  servicesTitle,
  initHomepage,
  isLoading: servicesLoading
} = useHomepage()

// Use team members data
const { 
  featuredTeamMembers,
  getFeaturedTeamMembers,
  getTeamMemberImageUrl,
  getTeamMemberName,
  getTestimonial,
  getPosition,
  isLoading: teamMembersLoading
} = useTeamMembers()

// Use master data for departments and locations
const { getActiveDepartments } = useDepartments()
const { getActiveLocations } = useLocations()

// Image fallback handler
const { handleImageError } = useImageFallback()

// Initialize data on mount
onMounted(async () => {
  // Small delay to ensure skeleton shows
  await new Promise(resolve => setTimeout(resolve, 100))
  await Promise.all([
    loadJoinUsData(),
    initHomepage(),
    fetchMasterData(),
    fetchFeaturedCareers(),
    getFeaturedTeamMembers(3),
    fetchWorkplace(),
    fetchWorkplaceConfigs()
  ])
  
  // Add click listener for dropdown close
  document.addEventListener('click', closeDropdowns)
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})

// Watch for language changes and refetch data
watch(() => locale.value, () => {
  loadJoinUsData()
  initHomepage()
  fetchMasterData()
  fetchFeaturedCareers()
  getFeaturedTeamMembers(3)
  fetchWorkplace()
}, { immediate: false })

// Computed data for easier template access
const heroData = computed(() => ({
  title: joinUsData.value.bannerTitle || joinUsData.value.heroTitle,
  description: joinUsData.value.bannerDescription,
  backgroundImage: joinUsData.value.bannerImage || "/img/dummy1.jpg"
}))

const ceoMessage = computed(() => joinUsData.value.ceoMessage)

// Services data now comes from useHomepage() composable

// Slider container reference
const sliderContainer = ref<HTMLElement | null>(null)

// Drag to scroll functionality
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const startDrag = (e: MouseEvent) => {
  if (!sliderContainer.value) return
  
  // Prevent default image drag behavior
  e.preventDefault()
  
  isDragging.value = true
  startX.value = e.pageX - sliderContainer.value.offsetLeft
  scrollLeft.value = sliderContainer.value.scrollLeft
  sliderContainer.value.style.cursor = 'grabbing'
  
  // Disable scroll behavior temporarily for immediate response
  sliderContainer.value.style.scrollBehavior = 'auto'
}

const drag = (e: MouseEvent) => {
  if (!isDragging.value || !sliderContainer.value) return
  
  e.preventDefault()
  const x = e.pageX - sliderContainer.value.offsetLeft
  const walk = (x - startX.value) * 2 // Multiply by 2 for faster scrolling
  sliderContainer.value.scrollLeft = scrollLeft.value - walk
}

const endDrag = () => {
  if (!sliderContainer.value) return
  
  isDragging.value = false
  sliderContainer.value.style.cursor = 'grab'
  
  // Re-enable smooth scroll behavior
  sliderContainer.value.style.scrollBehavior = 'smooth'
}

// Team members now come from API via useTeamMembers composable

// Disable touchpad/wheel scroll (commented out)
// const handleWheel = (event: WheelEvent) => {
//   if (!sliderContainer.value) return
//   
//   // Convert vertical scroll to horizontal
//   if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
//     event.preventDefault()
//     sliderContainer.value.scrollBy({
//       left: event.deltaY,
//       behavior: 'smooth'
//     })
//   }
// }

// Add event listeners on mount
onMounted(() => {
  // Use nextTick to ensure DOM is ready
  nextTick(() => {
    if (sliderContainer.value) {
      // Only drag to scroll events (wheel scroll disabled)
      sliderContainer.value.addEventListener('mousedown', startDrag)
      sliderContainer.value.addEventListener('mousemove', drag)
      sliderContainer.value.addEventListener('mouseup', endDrag)
      sliderContainer.value.addEventListener('mouseleave', endDrag)
      
      // Prevent text selection while dragging
      sliderContainer.value.addEventListener('selectstart', (e) => e.preventDefault())
    }
  })
})

// Remove event listeners on unmount
onUnmounted(() => {
  if (sliderContainer.value) {
    sliderContainer.value.removeEventListener('mousedown', startDrag)
    sliderContainer.value.removeEventListener('mousemove', drag)
    sliderContainer.value.removeEventListener('mouseup', endDrag)
    sliderContainer.value.removeEventListener('mouseleave', endDrag)
  }
})

// Workplace API integration
const { getFeaturedWorkplaces } = useWorkplace()

// Workplace data
const workplaceHighlights = ref([])
const workplaceLoading = ref(false)
const workplaceError = ref(null)

// Fetch workplace data
const fetchWorkplace = async () => {
  try {
    workplaceLoading.value = true
    workplaceError.value = null
    
    const response = await getFeaturedWorkplaces(6) // Fetch up to 6 items to allow scrolling
    if (response.success) {
      workplaceHighlights.value = response.data.data || []
    }
  } catch (err) {
    workplaceError.value = err?.message || 'Failed to fetch workplace data'
  } finally {
    workplaceLoading.value = false
  }
}

// Careers API integration
const { getFeaturedCareers } = useCareers()

// Search and filter states
const searchQuery = ref("")
const selectedDepartment = ref("")
const selectedLocation = ref("")

// Dynamic departments and locations from API
const departments = ref<string[]>([])
const locations = ref<string[]>([])

// Fetch master data for departments and locations
const fetchMasterData = async () => {
  try {
    const [departmentsResponse, locationsResponse] = await Promise.all([
      getActiveDepartments(),
      getActiveLocations()
    ])
    
    
    if (departmentsResponse.success && departmentsResponse.data) {
      departments.value = departmentsResponse.data.map(dept => dept.name_id)
    } else {
    }
    
    if (locationsResponse.success && locationsResponse.data) {
      locations.value = locationsResponse.data.map(loc => loc.name_id)
    } else {
    }
  } catch (err) {
  }
}

// Dropdown state
const isDepartmentDropdownOpen = ref(false)
const isLocationDropdownOpen = ref(false)

// Careers data
const featuredCareers = ref<any[]>([])
const careersLoading = ref(false)
const careersError = ref<string | null>(null)

// Fetch featured careers (limit to 4 for join-us page)
const fetchFeaturedCareers = async () => {
  try {
    careersLoading.value = true
    careersError.value = null
    
    const response = await getFeaturedCareers(4)
    if (response.success) {
      featuredCareers.value = response.data
    }
  } catch (err: any) {
    careersError.value = err?.message || 'Failed to fetch careers'
  } finally {
    careersLoading.value = false
  }
}

// Filtered jobs
const filteredJobs = computed(() => {
  if (!featuredCareers.value?.length) return []
  
  return featuredCareers.value.filter(job => {
    const matchesSearch = job.title_id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         (job.department_id && job.department_id.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesDepartment = !selectedDepartment.value || 
                             job.department_id === selectedDepartment.value ||
                             (job.tags && job.tags.includes(selectedDepartment.value))
    const matchesLocation = !selectedLocation.value || job.location_id.includes(selectedLocation.value)
    
    return matchesSearch && matchesDepartment && matchesLocation
  })
})

const getDepartmentColor = (department: string) => {
  const colors = {
    'Finance': 'text-red-100',
    'People & Operation': 'text-red-100', 
    'Technology': 'text-red-100',
    'Marketing': 'text-red-100',
    'Sales': 'text-red-100'
  }
  return colors[department] || 'text-red-100'
}

// Dropdown handlers
const toggleDepartmentDropdown = (event: Event) => {
  event.stopPropagation()
  isDepartmentDropdownOpen.value = !isDepartmentDropdownOpen.value
  isLocationDropdownOpen.value = false
}

const toggleLocationDropdown = (event: Event) => {
  event.stopPropagation()
  isLocationDropdownOpen.value = !isLocationDropdownOpen.value
  isDepartmentDropdownOpen.value = false
}

const selectDepartment = (dept: string, event: Event) => {
  event.stopPropagation()
  selectedDepartment.value = dept
  isDepartmentDropdownOpen.value = false
}

const selectLocation = (loc: string, event: Event) => {
  event.stopPropagation()
  selectedLocation.value = loc
  isLocationDropdownOpen.value = false
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  isDepartmentDropdownOpen.value = false
  isLocationDropdownOpen.value = false
}

// Testimonial modal state
const showTestimonialModal = ref(false)
const selectedMember = ref(null)
const selectedMemberIndex = ref(0)

// Modal methods
const openTestimonialModal = (member) => {
  selectedMember.value = member
  selectedMemberIndex.value = featuredTeamMembers.value.findIndex(m => m.id === member.id)
  showTestimonialModal.value = true
  document.body.style.overflow = 'hidden' // Prevent background scroll
}

const closeTestimonialModal = () => {
  showTestimonialModal.value = false
  selectedMember.value = null
  selectedMemberIndex.value = 0
  document.body.style.overflow = 'auto' // Restore scroll
}

const selectMemberByIndex = (index) => {
  selectedMemberIndex.value = index
  selectedMember.value = featuredTeamMembers.value[index]
}

// Helper function to get full content for modal
const getFullContent = (member, locale = 'id') => {
  if (locale === 'en' && member.content_en) {
    return member.content_en
  }
  return member.content_id || ''
}

// Helper function to format content with line breaks
const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && showTestimonialModal.value) {
      closeTestimonialModal()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  return () => {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <JoinUsPageSkeleton v-if="joinUsData.isLoading" />
    
    <!-- Content State -->
    <div v-else>
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
      <div class="relative z-10 text-white text-center max-w-4xl mx-auto px-4">
        <h1 class="xl:text-5xl text-2xl font-bold mb-4">
          {{ heroData.title }}
        </h1>
        <p v-if="heroData.description" class="text-lg xl:text-xl opacity-90 leading-relaxed">
          {{ heroData.description }}
        </p>
      </div>
    </div>

    <!-- CEO Message Section -->
    <div class="px-3 xl:px-15 py-12 xl:py-16">
      <div class="max-w-7xl mx-auto">
        <!-- No Data Alert -->
        <NoDataAlert 
          v-if="!ceoMessage.content || ceoMessage.content.trim() === ''"
          :title="t('joinUs.noCeoMessage')"
          :message="t('joinUs.noCeoMessageDescription')"
          :show-button="false"
        />
        
        <!-- CEO Message Content -->
        <div v-else class="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-16 items-center">
          <div class="order-2 xl:order-1">
            <h2 class="text-black-100 font-bold text-3xl xl:text-5xl mb-8 xl:mb-10">
              {{ ceoMessage.title }}
            </h2>
            <div class="text-black-100 text-base xl:text-xl leading-relaxed xl:leading-loose space-y-6 text-justify">
              <p v-for="paragraph in ceoMessage.content.split('\n\n')" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </div>
          <div class="order-1 xl:order-2 flex justify-center">
            <div class="relative">
              <img
                :src="ceoMessage.image || '/img/placeholder-ceo.jpg'"
                alt="CEO"
                class="w-80 xl:w-96 h-auto object-cover rounded-2xl shadow-lg"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Separator Line -->
    <div class="px-3 xl:px-15">
      <hr class="border-t border-gray-300 my-8 xl:my-12">
    </div>

    <!-- Get to Know Our Work Section -->
    <div class="px-3 xl:px-15 py-16 xl:py-20">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-black-100 font-bold text-3xl xl:text-5xl mb-12 xl:mb-16 text-center">
          {{ t('joinUs.getStarted') }}
        </h2>
        
        <!-- Loading State -->
        <div v-if="servicesLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-15">
          <div v-for="n in 3" :key="n" class="animate-pulse">
            <div class="w-full max-w-100 mx-auto rounded-2xl p-3 flex flex-col gap-5 bg-white">
              <div class="w-full h-25 xl:h-43 bg-gray-200 rounded"></div>
              <div class="p-3 rounded-xl flex flex-col gap-2 items-center justify-center h-auto xl:h-35 bg-white/50">
                <div class="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div class="h-4 w-full bg-gray-200 rounded"></div>
                <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Services Content -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-15">
          <div
            v-for="service in services"
            :key="service.id"
            class="transition-all duration-300"
          >
            <div
              class="w-full max-w-100 mx-auto rounded-2xl p-3 flex flex-col gap-5 transition-all duration-300 select-none cursor-pointer bg-white hover:bg-red-50"
            >
              <img
                :src="service.featured_image || '/img/services/placeholder.png'"
                :alt="service.title"
                class="w-full h-25 xl:h-43 object-contain"
                @error="handleImageError"
              />
              <div
                class="p-3 rounded-xl flex flex-col gap-2 items-center justify-center h-auto xl:h-35 bg-white/50"
              >
                <p
                  class="text-red-100 text-center font-bold text-lg xl:text-xl"
                >
                  {{ locale === 'en' && service.title_en ? service.title_en : service.title }}
                </p>
                <p
                  class="text-center text-sm xl:text-base text-red-100"
                >
                  {{ locale === 'en' && service.excerpt_en ? service.excerpt_en : service.excerpt }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Separator Line -->
    <div class="px-3 xl:px-15">
      <hr class="border-t border-gray-300 my-8 xl:my-12">
    </div>

    <!-- What They Say Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <!-- Loading State -->
      <div v-if="teamMembersLoading" class="relative">
        <div 
          class="overflow-x-auto focus:outline-none"
          style="scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div class="flex gap-6 xl:gap-8 pb-4 max-w-7xl mx-auto">
            <div v-for="n in 3" :key="n" class="flex-shrink-0 w-[28rem] xl:w-[32rem] bg-white rounded-xl overflow-hidden shadow-md">
              <div class="flex h-64 xl:h-80">
                <!-- Left Side - Image Skeleton -->
                <div class="w-1/2 relative bg-gray-200 animate-pulse"></div>
                <!-- Right Side - Text Skeleton -->
                <div class="w-1/2 p-4 flex flex-col justify-center bg-white">
                  <div class="mb-4">
                    <div class="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div class="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div class="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Testimonials Slider -->
      <div v-else-if="!teamMembersLoading && featuredTeamMembers && featuredTeamMembers.length > 0" class="relative">
        <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
          {{ t('joinUs.whatTheySay') }}
        </h2>
        <div 
          class="overflow-x-auto focus:outline-none cursor-grab select-none"
          style="scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;"
          tabindex="0"
        >
          <div class="flex gap-6 xl:gap-8 pb-4 max-w-7xl mx-auto">
            <!-- Dynamic Testimonials from API -->
            <div
              v-for="member in featuredTeamMembers"
              :key="member.id"
              class="flex-shrink-0 w-[28rem] xl:w-[32rem] bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
              @click="openTestimonialModal(member)"
            >
              <div class="flex h-64 xl:h-80">
                <!-- Left Side - Image (50%) -->
                <div class="w-1/2 relative">
                  <img
                    :src="getTeamMemberImageUrl(member)"
                    :alt="getTeamMemberName(member, locale)"
                    class="w-full h-full object-cover pointer-events-none select-none"
                    draggable="false"
                    @error="handleImageError"
                  />
                </div>
                <!-- Right Side - Text Content (50%) -->
                <div class="w-1/2 p-4 flex flex-col justify-center bg-white">
                  <div class="mb-4">
                    <h3 class="text-black-100 font-bold text-sm xl:text-base mb-2">
                      {{ getTeamMemberName(member, locale) }}
                    </h3>
                    <p class="text-gray-600 text-xs xl:text-sm">
                      {{ getPosition(member, locale) }}
                    </p>
                  </div>
                  <p v-if="getTestimonial(member, locale)" class="text-black-100 text-sm xl:text-base leading-relaxed">
                    "{{ getTestimonial(member, locale) }}"
                  </p>
                  <p v-else class="text-gray-400 text-sm xl:text-base leading-relaxed italic">
                    {{ t('joinUs.noTestimonialAvailable') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
          {{ t('joinUs.whatTheySay') }}
        </h2>
        <div class="max-w-md mx-auto">
          <p class="text-gray-500 text-lg mb-4">{{ t('joinUs.noTeamMembers') }}</p>
          <p class="text-gray-400 text-sm">{{ t('joinUs.noTeamMembersDescription') }}</p>
        </div>
      </div>
    </div>

    <!-- Testimonial Bottom Sheet Modal -->
    <div
      v-if="showTestimonialModal"
      class="fixed inset-0 z-50 flex items-end"
      style="background-color: rgba(0, 0, 0, 0.3);"
      @click="closeTestimonialModal"
    >
      <!-- Bottom Sheet Content -->
      <div
        class="w-full bg-white rounded-t-3xl transform transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto"
        :class="showTestimonialModal ? 'translate-y-0' : 'translate-y-full'"
        @click.stop
      >
        <!-- Close Button -->
        <div class="absolute top-6 right-6 z-10">
          <button
            @click="closeTestimonialModal"
            class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-8 pt-16">
          <div v-if="selectedMember" class="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            <!-- Left Side - Image -->
            <div class="flex-shrink-0 mx-auto md:mx-0">
              <img
                :src="getTeamMemberImageUrl(selectedMember)"
                :alt="getTeamMemberName(selectedMember, locale)"
                class="w-64 h-80 md:w-80 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            <!-- Right Side - Content -->
            <div class="flex-1">
              <!-- Name and Position -->
              <div class="mb-6">
                <h2 class="text-3xl font-bold text-black leading-tight">
                  {{ getTeamMemberName(selectedMember, locale) }}<span class="text-lg text-gray-600 font-normal ml-3">{{ getPosition(selectedMember, locale) }}</span>
                </h2>
              </div>

              <!-- Biography/Content -->
              <div class="text-gray-700 leading-relaxed text-base space-y-4">
                <div v-if="getFullContent(selectedMember, locale)" v-html="formatContent(getFullContent(selectedMember, locale))">
                </div>
                <div v-else-if="getTestimonial(selectedMember, locale)">
                  {{ getTestimonial(selectedMember, locale) }}
                </div>
                <div v-else class="text-gray-400 italic">
                  {{ t('joinUs.noDetailedInformation') }}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Explore Our Workplace Section -->
    <div class="bg-grey px-3 xl:px-15 py-8 xl:py-12">
      <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
        {{ t('joinUs.exploreOurWorkplace') }}
      </h2>
      
      <!-- Content State -->
      <div class="space-y-16">
        <!-- Loading State for Static Cards -->
        <div v-if="configLoading" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div v-for="n in 2" :key="n" class="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div class="h-64 bg-gray-200 animate-pulse"></div>
            <div class="p-6 space-y-4">
              <div class="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6 mx-auto"></div>
                <div class="h-4 bg-gray-200 rounded animate-pulse w-4/5 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Static 2 Cards from CMS -->
        <div v-else-if="!configLoading" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <!-- Working Environment Card -->
          <div 
            class="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            @click="handleWorkplaceCardClick('working_environment')"
          >
            <div class="h-64 overflow-hidden">
              <img
                :src="getWorkplaceImage('working_environment')"
                :alt="getWorkplaceTitle('working_environment')"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div class="p-6">
              <h3 class="text-black font-bold text-xl text-center mb-4">
                {{ getWorkplaceTitle('working_environment') }}
              </h3>
              <p class="text-gray-600 text-sm text-center leading-relaxed">
                {{ getWorkplaceDescription('working_environment') }}
              </p>
            </div>
          </div>
          
          <!-- Employee Benefits Card -->
          <div 
            class="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            @click="handleWorkplaceCardClick('employee_benefits')"
          >
            <div class="h-64 overflow-hidden">
              <img
                :src="getWorkplaceImage('employee_benefits')"
                :alt="getWorkplaceTitle('employee_benefits')"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div class="p-6">
              <h3 class="text-black font-bold text-xl text-center mb-4">
                {{ getWorkplaceTitle('employee_benefits') }}
              </h3>
              <p class="text-gray-600 text-sm text-center leading-relaxed">
                {{ getWorkplaceDescription('employee_benefits') }}
              </p>
            </div>
          </div>
        </div>


        <!-- Dynamic Working Environment Section -->
        <div id="working-environment-section" v-if="workplaceHighlights && workplaceHighlights.length > 0" class="mt-16">
          <h3 class="text-black font-bold text-3xl text-center mb-12">
            {{ t('workplace.workingEnvironment.title') }}
          </h3>
          
          <!-- Mobile: Show exactly 3 cards in scroll container -->
          <div class="overflow-x-auto md:hidden scrollbar-hide mx-auto" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 896px; max-width: 100%;">
            <div class="flex gap-4 px-4 pb-2" style="width: max-content;">
              <div
                v-for="highlight in workplaceHighlights"
                :key="highlight.id"
                class="flex-shrink-0 w-72 text-center"
              >
                <div class="h-44 rounded-2xl overflow-hidden shadow-lg mb-4">
                  <img
                    :src="highlight.featured_image_url || highlight.featured_image || '/img/placeholder-workplace.jpg'"
                    :alt="locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <h4 class="text-black font-normal text-base">
                  {{ locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id }}
                </h4>
              </div>
            </div>
          </div>
          
          <!-- Desktop: Show exactly 3 cards with scroll if more -->
          <div class="hidden md:block">
            <div class="overflow-x-auto scrollbar-hide mx-auto" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 1248px; max-width: 100%;">
              <div class="flex gap-8 px-4 pb-2" style="width: max-content;">
                <div
                  v-for="highlight in workplaceHighlights"
                  :key="highlight.id"
                  class="flex-shrink-0 w-96 text-center"
                >
                  <div class="h-52 rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img
                      :src="highlight.featured_image_url || highlight.featured_image || '/img/placeholder-workplace.jpg'"
                      :alt="locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                  </div>
                  <h4 class="text-black font-normal text-base">
                    {{ locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id }}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Separator Line within same background -->
      <hr class="border-t border-gray-300 my-8 xl:my-12">
      
      <!-- Be a Part of Our Team Section (in same container) -->
      <h2 class="text-black-100 font-bold text-2xl xl:text-4xl mb-8 xl:mb-12 text-center">
        {{ t('joinUs.beAPartOfOurTeam') }}
      </h2>
      
      <!-- Search and Filters -->
      <div class="mb-8 xl:mb-12">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8">
            <!-- Search Input - matches Job Title column -->
            <div class="relative">
              <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-divider size-5" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('joinUs.searchPlaceholder')"
                class="w-full pl-10 pr-4 py-3 border border-divider rounded-full focus:outline-none focus:border-red-100 text-base bg-white"
              />
            </div>
            
            <!-- Department Filter - matches Department column -->
            <div class="relative" @click.away="closeDropdowns">
              <button
                @click="toggleDepartmentDropdown($event)"
                class="flex items-center justify-between w-full bg-white border border-divider rounded-full px-6 py-3 focus:outline-none focus:border-red-100 text-base cursor-pointer"
              >
                <span class="text-left">
                  {{ selectedDepartment || t('joinUs.allDepartments') }}
                </span>
                <Icon 
                  name="mdi:chevron-up" 
                  v-if="isDepartmentDropdownOpen"
                  class="text-divider size-5 transition-transform duration-200" 
                />
                <Icon 
                  name="mdi:chevron-down" 
                  v-else
                  class="text-divider size-5 transition-transform duration-200" 
                />
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="isDepartmentDropdownOpen"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-divider rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                <div class="p-2">
                  <div
                    @click="selectDepartment('', $event)"
                    class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>{{ t('joinUs.allDepartments') }}</span>
                    <Icon 
                      v-if="!selectedDepartment"
                      name="mdi:check" 
                      class="text-red-100 size-5" 
                    />
                  </div>
                  <div
                    v-for="dept in departments"
                    :key="dept"
                    @click="selectDepartment(dept, $event)"
                    class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>{{ dept }}</span>
                    <Icon 
                      v-if="selectedDepartment === dept"
                      name="mdi:check" 
                      class="text-red-100 size-5" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Location Filter - matches Location column -->
            <div class="relative" @click.away="closeDropdowns">
              <button
                @click="toggleLocationDropdown($event)"
                class="flex items-center justify-between w-full bg-white border border-divider rounded-full px-6 py-3 focus:outline-none focus:border-red-100 text-base cursor-pointer"
              >
                <span class="text-left">
                  {{ selectedLocation || t('joinUs.allLocations') }}
                </span>
                <Icon 
                  name="mdi:chevron-up" 
                  v-if="isLocationDropdownOpen"
                  class="text-divider size-5 transition-transform duration-200" 
                />
                <Icon 
                  name="mdi:chevron-down" 
                  v-else
                  class="text-divider size-5 transition-transform duration-200" 
                />
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="isLocationDropdownOpen"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-divider rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                <div class="p-2">
                  <div
                    @click="selectLocation('', $event)"
                    class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>{{ t('joinUs.allLocations') }}</span>
                    <Icon 
                      v-if="!selectedLocation"
                      name="mdi:check" 
                      class="text-red-100 size-5" 
                    />
                  </div>
                  <div
                    v-for="location in locations"
                    :key="location"
                    @click="selectLocation(location, $event)"
                    class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>{{ location }}</span>
                    <Icon 
                      v-if="selectedLocation === location"
                      name="mdi:check" 
                      class="text-red-100 size-5" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Listings Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Job Listings Table -->
        <div class="mb-8 xl:mb-12">
          <!-- Loading State -->
          <div v-if="careersLoading" class="space-y-0">
            <div v-for="n in 4" :key="n" class="border-b border-grey py-4">
              <!-- Mobile Skeleton -->
              <div class="block md:hidden">
                <div class="flex flex-col space-y-3">
                  <!-- Job Title Skeleton -->
                  <div>
                    <div class="bg-gray-200 animate-pulse h-4 w-24 mb-1 rounded"></div>
                    <div class="bg-gray-200 animate-pulse h-5 w-48 rounded"></div>
                  </div>
                  
                  <!-- Department & Location Row Skeleton -->
                  <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                      <div class="bg-gray-200 animate-pulse h-3 w-16 mb-1 rounded"></div>
                      <div class="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                    </div>
                    <div class="flex flex-col">
                      <div class="bg-gray-200 animate-pulse h-3 w-12 mb-1 rounded"></div>
                      <div class="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Desktop Skeleton -->
              <div class="hidden md:grid grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8 items-start">
                <!-- Job Title Column Skeleton -->
                <div class="flex flex-col">
                  <div class="bg-gray-200 animate-pulse h-4 w-24 mb-1 rounded"></div>
                  <div class="bg-gray-200 animate-pulse h-5 w-48 rounded"></div>
                </div>
                
                <!-- Department Column Skeleton -->
                <div class="flex flex-col pl-8">
                  <div class="bg-gray-200 animate-pulse h-4 w-20 mb-1 rounded"></div>
                  <div class="bg-gray-200 animate-pulse h-5 w-32 rounded"></div>
                </div>
                
                <!-- Location Column Skeleton -->
                <div class="flex flex-col">
                  <div class="bg-gray-200 animate-pulse h-4 w-16 mb-1 rounded"></div>
                  <div class="bg-gray-200 animate-pulse h-5 w-20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Job Rows -->
          <div v-else-if="!careersError" class="space-y-0">
            <NuxtLink
              v-for="job in filteredJobs"
              :key="job.id"
              :to="`/join-us/detail-job/${job.slug}`"
              class="block border-b border-grey py-4 hover:bg-gray-50 transition-all duration-300"
            >
              <!-- Mobile Layout -->
              <div class="block md:hidden">
                <div class="flex flex-col space-y-3">
                  <!-- Job Title -->
                  <div>
                    <span class="text-sm font-medium mb-1" :class="getDepartmentColor(job.department_id)">
                      {{ job.department_id || 'Department' }}
                    </span>
                    <h3 class="text-black-100 font-semibold text-base">
                      {{ job.title_id }}
                    </h3>
                  </div>
                  
                  <!-- Department & Location Row -->
                  <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                      <span class="text-divider text-xs font-medium mb-1">{{ t('joinUs.department') }}</span>
                      <span class="text-black-100 text-sm font-semibold">
                        {{ job.department_id || (job.tags && job.tags.length > 0 ? job.tags[0] : '-') }}
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-divider text-xs font-medium mb-1">{{ t('joinUs.location') }}</span>
                      <span class="text-black-100 text-sm font-semibold">{{ job.location_id }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Desktop Layout -->
              <div class="hidden md:grid grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8 items-start">
                <!-- Job Title Column -->
                <div class="flex flex-col">
                  <span class="text-sm font-medium mb-1" :class="getDepartmentColor(job.department_id)">
                    {{ job.department_id || 'Department' }}
                  </span>
                  <h3 class="text-black-100 font-semibold text-base xl:text-lg">
                    {{ job.title_id }}
                  </h3>
                </div>
                
                <!-- Department Column -->
                <div class="flex flex-col pl-8">
                  <span class="text-divider text-sm font-medium mb-1">{{ t('joinUs.department') }}</span>
                  <span class="text-black-100 text-base xl:text-lg font-semibold">
                    {{ job.department_id || (job.tags && job.tags.length > 0 ? job.tags[0] : '-') }}
                  </span>
                </div>
                
                <!-- Location Column -->
                <div class="flex flex-col">
                  <span class="text-divider text-sm font-medium mb-1">{{ t('joinUs.location') }}</span>
                  <span class="text-black-100 text-base xl:text-lg font-semibold">{{ job.location_id }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
          
          <!-- No Results -->
          <div v-if="!careersLoading && !careersError && filteredJobs.length === 0" class="text-center py-8">
            <Icon name="mdi:briefcase-search" class="w-12 h-12 text-divider mx-auto mb-3" />
            <p class="text-divider text-lg">{{ t('joinUs.noJobsFound') }}</p>
          </div>
          
          <!-- Error State -->
          <div v-if="careersError" class="text-center py-8">
            <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p class="text-red-500 text-lg mb-3">{{ careersError }}</p>
            <button 
              @click="fetchFeaturedCareers()"
              class="px-4 py-2 bg-red-100 text-white rounded-full hover:bg-red-200 transition-colors"
            >
              {{ t('joinUs.tryAgain') }}
            </button>
          </div>
        </div>

        <!-- See All Jobs Button -->
        <div class="flex justify-center">
          <NuxtLink
            to="/join-us/careers"
            class="py-3 px-8 rounded-full bg-red-100 hover:bg-red-75 transition-all duration-300 font-bold text-white text-lg xl:text-xl"
          >
            {{ t('joinUs.seeAllJobs') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for webkit browsers */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
