<template>
  <div 
    :class="[
      'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded',
      customClass
    ]"
    :style="{ width: width, height: height }"
  >
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '20px'
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-pulse {
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>