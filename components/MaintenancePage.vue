<script setup lang="ts">
import type { MaintenanceConfig } from '~/composables/useMaintenance'

interface Props {
  config: MaintenanceConfig
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-grey flex items-center justify-center px-4 py-8">
    <div class="max-w-2xl w-full text-center">
      <!-- Logo -->
      <div class="mb-8">
        <img 
          src="/img/logo.png" 
          alt="TEZ Capital & Finance" 
          class="h-16 mx-auto"
        />
      </div>

      <!-- Maintenance Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl xl:text-4xl font-bold text-black-100 mb-4">
        {{ config.title || t('maintenance.title') }}
      </h1>

      <!-- Message -->
      <p class="text-lg xl:text-xl text-black-100 mb-8 leading-relaxed">
        {{ config.message || t('maintenance.message') }}
      </p>

      <!-- Estimated Time -->
      <!-- <div class="bg-white rounded-lg p-6 shadow-sm mb-8" v-if="config.estimated_time">
        <div class="flex items-center justify-center mb-2">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {{ t('maintenance.estimatedTime') }}
          </span>
        </div>
        <p class="text-xl font-semibold text-black-100">
          {{ config.estimated_time }}
        </p>
      </div> -->

      <!-- Contact Information -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-8" v-if="config.contact_email">
        <div class="flex items-center justify-center mb-2">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {{ t('maintenance.contactUs') }}
          </span>
        </div>
        <a 
          :href="`mailto:${config.contact_email}`"
          class="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {{ config.contact_email }}
        </a>
      </div>

      <!-- Refresh Button -->
      <button 
        @click="$router.go(0)"
        class="bg-red-100 hover:bg-red-200 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
      >
        {{ t('maintenance.refresh') }}
      </button>

      <!-- Footer -->
      <div class="mt-12 text-center">
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} TEZ Capital & Finance. {{ t('maintenance.footer') }}
        </p>
      </div>
    </div>
  </div>
</template>