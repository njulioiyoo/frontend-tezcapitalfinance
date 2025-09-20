<template>
  <div class="bg-red-50 border border-red-200 rounded-lg p-4 mx-3 xl:mx-15 my-8" v-if="error">
    <div class="flex items-center">
      <Icon name="mdi:alert-circle" class="text-red-600 size-6 mr-3" />
      <div>
        <h3 class="text-sm font-medium text-red-800">
          {{ title || 'Terjadi Kesalahan' }}
        </h3>
        <p class="text-sm text-red-700 mt-1" v-if="message">
          {{ message }}
        </p>
        <p class="text-sm text-red-700 mt-1" v-else>
          Gagal memuat data. Silakan refresh halaman atau coba lagi nanti.
        </p>
      </div>
    </div>
    <div class="mt-4" v-if="showRetry">
      <button 
        @click="$emit('retry')"
        class="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
      >
        Coba Lagi
      </button>
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