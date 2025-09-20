<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div class="flex items-center">
      <Icon name="mdi:information" class="text-yellow-600 size-6 mr-3" />
      <p class="text-yellow-800">
        {{ message || `Data "${section}" tidak tersedia saat ini.` }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  section: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  }
})
</script>