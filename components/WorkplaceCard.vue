<template>
  <div class="relative rounded-lg overflow-hidden border border-gray-200">
    <div class="relative">
      <img 
        :src="section.image" 
        :alt="section.title"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      />
    </div>

    <div class="p-6 bg-white">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">
        {{ section.title }}
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ section.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface WorkplaceSection {
  id: number
  title: string
  description: string
  image: string
  highlighted?: boolean
}

interface Props {
  section: WorkplaceSection
}

const props = defineProps<Props>()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/img/placeholder-workplace.jpg'
}
</script>