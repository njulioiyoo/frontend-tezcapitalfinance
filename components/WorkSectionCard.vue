<template>
  <div class="text-center p-6">
    <div class="flex justify-center mb-6">
      <div class="w-40 h-40 flex items-center justify-center rounded-2xl">
        <img 
          :src="section.icon" 
          :alt="section.title"
          class="w-40 h-40 object-contain"
        />
      </div>
    </div>

    <h3 class="text-xl font-bold text-gray-900 mb-4">
      {{ section.title }}
    </h3>

    <p class="text-sm text-gray-600 leading-relaxed">
      {{ section.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface WorkSection {
  id: number
  title: string
  description: string
  icon: string
  color: string
}

interface Props {
  section: WorkSection
}

const props = defineProps<Props>()
</script>