<script setup lang="ts">
interface Props {
  isOpen: boolean
  imageUrl: string
  imageAlt: string
  imageTitle?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Close modal when clicking outside or pressing escape
const handleClose = () => {
  emit('close')
}

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      handleClose()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Prevent background scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = 'auto'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="handleClose"
      >
        <!-- Modal Content -->
        <div
          class="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
          @click.stop
        >

          <!-- Image Container -->
          <div class="relative w-full h-full flex flex-col items-center justify-center">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="isOpen" class="relative">
                <img
                  :src="imageUrl"
                  :alt="imageAlt"
                  class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  loading="lazy"
                />
                
                <!-- Close Button - on top right of image -->
                <button
                  @click="handleClose"
                  class="absolute -top-2 -right-2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-lg"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </Transition>
            
            <!-- Image Title - below image -->
            <div
              v-if="imageTitle"
              class="mt-4 text-center"
            >
              <div class="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 mx-auto inline-block">
                <p class="text-gray-800 font-medium">{{ imageTitle }}</p>
              </div>
            </div>
            
            <!-- Navigation Hint - below title -->
            <div class="mt-2 text-white/70 text-sm bg-black/40 backdrop-blur-sm rounded px-3 py-2">
              <span class="hidden md:inline">Press ESC or click outside to close</span>
              <span class="md:hidden">Tap outside to close</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>