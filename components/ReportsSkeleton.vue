<template>
  <div class="space-y-6">
    <!-- Financial Reports Skeleton -->
    <div v-if="type === 'financial'" class="w-full">
      <!-- Tabs Skeleton -->
      <div class="flex flex-col max-w-full xl:max-w-75 border-0 h-fit mb-6">
        <div 
          v-for="i in 3" 
          :key="i" 
          class="w-full flex justify-between items-center px-4 py-3 mb-2"
        >
          <SkeletonLoader class="h-4 w-40" />
          <SkeletonLoader class="h-4 w-4" />
        </div>
      </div>
      
      <!-- Reports Grid Skeleton -->
      <div class="flex flex-col gap-6">
        <div 
          v-for="i in count" 
          :key="i" 
          class="flex rounded-xl xl:rounded-3xl overflow-hidden shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)]"
        >
          <div class="bg-gray-200 px-6 xl:px-12 flex items-center justify-center animate-pulse">
            <div class="size-10 xl:size-12 bg-gray-300 rounded"></div>
          </div>
          <div class="flex flex-col p-4 xl:p-6 gap-2 w-full">
            <SkeletonLoader class="h-5 w-32" />
            <SkeletonLoader class="h-6 xl:h-8 w-64" />
            <SkeletonLoader class="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>

    <!-- Annual Reports Skeleton -->
    <div v-else-if="type === 'annual'" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div 
        v-for="i in count" 
        :key="i" 
        class="flex h-auto xl:h-50 rounded-xl xl:rounded-3xl overflow-hidden shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)]"
      >
        <div class="bg-gray-200 px-6 xl:px-12 flex items-center justify-center animate-pulse">
          <div class="size-10 xl:size-15 bg-gray-300 rounded"></div>
        </div>
        <div class="flex flex-col p-4 xl:p-6 gap-6 justify-between w-full">
          <div class="flex flex-col gap-3">
            <SkeletonLoader class="h-6 xl:h-8 w-16" />
            <SkeletonLoader class="h-4 xl:h-5 w-48" />
            <SkeletonLoader class="h-3 w-20" />
          </div>
          <SkeletonLoader class="h-4 w-24" />
        </div>
      </div>
    </div>

    <!-- Generic Reports Skeleton -->
    <div v-else class="space-y-4">
      <div 
        v-for="i in count" 
        :key="i" 
        class="flex items-center p-4 border border-gray-200 rounded-lg"
      >
        <div class="bg-gray-200 p-3 rounded-lg mr-4 animate-pulse">
          <div class="size-8 bg-gray-300 rounded"></div>
        </div>
        <div class="flex-1 space-y-2">
          <SkeletonLoader class="h-4 w-3/4" />
          <SkeletonLoader class="h-3 w-1/2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'financial' | 'annual' | 'generic'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'generic',
  count: 6
})
</script>