<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <Icon name="mdi:information" class="text-yellow-600 size-5 sm:size-6 mr-3 mt-0.5" />
      </div>
      <div class="flex-1">
        <h3 v-if="title" class="text-sm sm:text-base font-semibold text-yellow-800 mb-2">
          {{ title }}
        </h3>
        <p class="text-xs sm:text-sm text-yellow-800 leading-relaxed">
          {{ message || `Data "${section}" tidak tersedia saat ini.` }}
        </p>
        <div v-if="showButton && buttonText" class="mt-3 sm:mt-4">
          <NuxtLink 
            v-if="buttonLink"
            :to="buttonLink"
            class="inline-block px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-700 hover:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-colors duration-200"
          >
            {{ buttonText }}
          </NuxtLink>
          <button 
            v-else
            @click="$emit('buttonClick')"
            class="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-700 hover:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-colors duration-200"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  section: {
    type: String,
    required: false,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  showButton: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: ''
  },
  buttonLink: {
    type: String,
    default: ''
  }
})

defineEmits(['buttonClick'])
</script>