<script setup lang="ts">
interface WorkplaceItem {
  id: number
  title_id: string
  title_en: string
  featured_image_url?: string
  featured_image?: string
}

interface Props {
  items: WorkplaceItem[]
  title: string
}

const props = defineProps<Props>()
const { locale } = useI18n()

// Slider refs
const mobileSliderRef = ref<HTMLElement | null>(null)
const desktopSliderRef = ref<HTMLElement | null>(null)

// Slider state
const currentSlide = ref(0)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

// Image zoom modal state
const showZoomModal = ref(false)
const selectedImage = ref({
  url: '',
  alt: '',
  title: ''
})

// Calculate slide dimensions
const slideWidth = {
  mobile: 304, // 288px + 16px gap
  desktop: 416  // 384px + 32px gap
}

// Update scroll buttons state
const updateScrollState = () => {
  if (desktopSliderRef.value) {
    const container = desktopSliderRef.value.querySelector('.overflow-x-auto')
    if (container) {
      canScrollLeft.value = container.scrollLeft > 0
      canScrollRight.value = container.scrollLeft < (container.scrollWidth - container.clientWidth)
    }
  }
}

// Scroll functions
const scrollLeft = () => {
  const container = desktopSliderRef.value?.querySelector('.overflow-x-auto')
  if (container) {
    container.scrollBy({
      left: -slideWidth.desktop,
      behavior: 'smooth'
    })
    setTimeout(updateScrollState, 300)
  }
}

const scrollRight = () => {
  const container = desktopSliderRef.value?.querySelector('.overflow-x-auto')
  if (container) {
    container.scrollBy({
      left: slideWidth.desktop,
      behavior: 'smooth'
    })
    setTimeout(updateScrollState, 300)
  }
}

// Handle image click for zoom
const handleImageClick = (item: WorkplaceItem) => {
  selectedImage.value = {
    url: item.featured_image_url || item.featured_image || '',
    alt: locale.value === 'en' && item.title_en ? item.title_en : item.title_id,
    title: locale.value === 'en' && item.title_en ? item.title_en : item.title_id
  }
  showZoomModal.value = true
}

// Close zoom modal
const closeZoomModal = () => {
  showZoomModal.value = false
}

// Initialize scroll state on mount
onMounted(() => {
  updateScrollState()
})
</script>

<template>
  <div>
    <!-- Slider Title -->
    <h3 class="text-black font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-8 sm:mb-12">
      {{ title }}
    </h3>

    <!-- Mobile: Show scroll container -->
    <div class="overflow-x-auto md:hidden scrollbar-hide mx-auto" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 896px; max-width: 100%;">
      <div class="flex gap-4 px-4 pb-2" style="width: max-content;">
        <div
          v-for="highlight in items"
          :key="highlight.id"
          class="flex-shrink-0 w-72 text-center cursor-pointer group"
          @click="handleImageClick(highlight)"
        >
          <div class="relative h-44 rounded-2xl overflow-hidden shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300">
            <img
              :src="highlight.featured_image_url || highlight.featured_image || '/img/placeholder-workplace.jpg'"
              :alt="locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div class="text-white text-center">
                <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
                <p class="text-sm font-medium">Click to view larger</p>
              </div>
            </div>
          </div>
          <h4 class="text-black font-normal text-base group-hover:text-red-100 transition-colors duration-200">
            {{ locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id }}
          </h4>
        </div>
      </div>
    </div>
    
    <!-- Desktop: Show scroll container with arrows -->
    <div class="hidden md:block relative" ref="desktopSliderRef">
      <!-- Left Arrow -->
      <button
        v-if="canScrollLeft"
        @click="scrollLeft"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 shadow-md rounded-full p-3 transition-all duration-200 hover:scale-110"
      >
        <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <!-- Right Arrow -->
      <button
        v-if="canScrollRight"
        @click="scrollRight"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 shadow-md rounded-full p-3 transition-all duration-200 hover:scale-110"
      >
        <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>

      <!-- Slider Container with peek effect -->
      <div 
        class="overflow-x-auto scrollbar-hide mx-auto" 
        style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: calc(100% - 96px); max-width: 1152px;"
        @scroll="updateScrollState"
      >
        <div class="flex gap-8 px-4 pb-2" style="width: max-content;">
          <div
            v-for="highlight in items"
            :key="highlight.id"
            class="flex-shrink-0 w-80 text-center cursor-pointer group"
            @click="handleImageClick(highlight)"
          >
            <div class="relative h-52 rounded-2xl overflow-hidden shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300">
              <img
                :src="highlight.featured_image_url || highlight.featured_image || '/img/placeholder-workplace.jpg'"
                :alt="locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              <!-- Overlay on Hover -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="text-white text-center">
                  <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                  <p class="text-sm font-medium">Click to view larger</p>
                </div>
              </div>
            </div>
            <h4 class="text-black font-normal text-base group-hover:text-red-100 transition-colors duration-200">
              {{ locale === 'en' && highlight.title_en ? highlight.title_en : highlight.title_id }}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Zoom Modal -->
    <ImageZoomModal
      :is-open="showZoomModal"
      :image-url="selectedImage.url"
      :image-alt="selectedImage.alt"
      :image-title="selectedImage.title"
      @close="closeZoomModal"
    />
  </div>
</template>