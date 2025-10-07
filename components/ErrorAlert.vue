<template>
  <div class="bg-red-50 border-l-4 border-red-400 rounded-md shadow-sm p-4 sm:p-6 mx-3 xl:mx-15 my-6 sm:my-8" v-if="error">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <Icon name="mdi:alert-circle" class="text-red-500 size-4 sm:size-5" />
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm sm:text-base font-semibold text-red-800 mb-2">
          {{ title || 'Failed to Load Data' }}
        </h3>
        <p class="text-xs sm:text-sm text-red-700 leading-relaxed" v-if="message">
          {{ message }}
        </p>
        <p class="text-xs sm:text-sm text-red-700 leading-relaxed" v-else>
          An error occurred while fetching news data. Please try again later.
        </p>
        <div class="mt-3 sm:mt-4" v-if="showRetry">
          <button 
            @click="$emit('retry')"
            class="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-75 border border-red-75 rounded-md hover:bg-red-100 hover:border-red-100 focus:outline-none focus:ring-2 focus:ring-red-75 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: [Error, String, Object],
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: true
  }
})

defineEmits(['retry'])
</script>