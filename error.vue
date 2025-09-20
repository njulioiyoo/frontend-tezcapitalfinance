<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

// Check if this is a maintenance mode error
const isMaintenanceMode = computed(() => {
  return props.error.statusCode === 503 && props.error.data?.maintenance === true
})

const maintenanceConfig = computed(() => {
  return props.error.data?.config || {
    enabled: true,
    title: 'Site Under Maintenance',
    message: 'We are currently performing scheduled maintenance. Please try again later.',
    estimated_time: '',
    contact_email: ''
  }
})

// Clear error and redirect to home
const handleErrorRedirect = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <!-- Maintenance Mode -->
    <MaintenancePage 
      v-if="isMaintenanceMode" 
      :config="maintenanceConfig" 
    />
    
    <!-- Regular Error Pages -->
    <div v-else class="min-h-screen bg-grey flex items-center justify-center px-4 py-8">
      <div class="max-w-2xl w-full text-center">
        <!-- Logo -->
        <div class="mb-8">
          <img 
            src="/img/logo.png" 
            alt="TEZ Capital & Finance" 
            class="h-16 mx-auto"
          />
        </div>

        <!-- Error Icon -->
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
        </div>

        <!-- Error Details -->
        <h1 class="text-3xl xl:text-4xl font-bold text-black-100 mb-4">
          {{ error.statusCode }} - {{ error.statusMessage }}
        </h1>

        <p class="text-lg xl:text-xl text-black-100 mb-8 leading-relaxed">
          {{ error.statusCode === 404 ? 'Halaman yang Anda cari tidak ditemukan.' : 'Terjadi kesalahan pada server.' }}
        </p>

        <!-- Back to Home Button -->
        <button 
          @click="handleErrorRedirect"
          class="bg-red-100 hover:bg-red-200 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Kembali ke Beranda
        </button>

        <!-- Footer -->
        <div class="mt-12 text-center">
          <p class="text-sm text-gray-500">
            © {{ new Date().getFullYear() }} TEZ Capital & Finance
          </p>
        </div>
      </div>
    </div>
  </div>
</template>