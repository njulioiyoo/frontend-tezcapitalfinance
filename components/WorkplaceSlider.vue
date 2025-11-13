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

// Image zoom modal state
const showZoomModal = ref(false)
const selectedImage = ref({
  url: '',
  alt: '',
  title: ''
})

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
    
    <!-- Desktop: Show scroll container -->
    <div class="hidden md:block">
      <div class="overflow-x-auto scrollbar-hide mx-auto" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 1248px; max-width: 100%;">
        <div class="flex gap-8 px-4 pb-2" style="width: max-content;">
          <div
            v-for="highlight in items"
            :key="highlight.id"
            class="flex-shrink-0 w-96 text-center cursor-pointer group"
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