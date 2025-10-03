<template>
  <NuxtLink 
    :to="`/detail-job/${job.id}`" 
    class="block transition-all duration-200 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
  >
    <div class="grid grid-cols-3 gap-8 py-5 px-6">
      <div class="flex flex-col">
        <span class="text-red-600 text-xs font-medium mb-1 tracking-wide">
          {{ job.category }}
        </span>
        <h3 class="text-gray-900 font-semibold text-base leading-snug hover:text-red-600 transition-colors">
          {{ job.title }}
        </h3>
      </div>
      <div class="flex flex-col">
        <span class="text-red-600 text-xs font-medium mb-1 tracking-wide">Department</span>
        <span class="text-gray-900 font-semibold text-sm">{{ job.department }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-red-600 text-xs font-medium mb-1 tracking-wide">Lokasi</span>
        <span class="text-gray-900 font-semibold text-sm">{{ job.location }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface JobPosition {
  id: number
  title: string
  category: string
  department: string
  location: string
}

interface Props {
  job: JobPosition
}

const props = defineProps<Props>()
</script>