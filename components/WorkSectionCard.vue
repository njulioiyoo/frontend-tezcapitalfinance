<template>
  <div class="text-center p-6">
    <div class="flex justify-center mb-4">
      <div class="w-16 h-16 flex items-center justify-center rounded-lg work-section-icon" :style="{ backgroundColor: section.color + '20' }">
        <Icon 
          :name="iconName" 
          class="w-8 h-8"
          :style="{ color: section.color }"
        />
      </div>
    </div>

    <h3 class="text-lg font-semibold text-gray-900 mb-3">
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

const iconName = computed(() => {
  const title = props.section.title.toLowerCase()
  
  if (title.includes('working capital')) {
    return 'mdi:chart-line'
  } else if (title.includes('investment')) {
    return 'mdi:account-group'
  } else if (title.includes('multi-purpose')) {
    return 'mdi:trending-up'
  } else {
    return 'mdi:briefcase'
  }
})
</script>