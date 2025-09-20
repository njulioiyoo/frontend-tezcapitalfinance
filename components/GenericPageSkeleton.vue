<template>
  <div>
    <!-- Hero Section Skeleton -->
    <div v-if="sections.includes('hero')" class="py-8 xl:py-12">
      <SkeletonLoader width="60%" height="48px" customClass="mx-auto mb-6" />
      <SkeletonLoader width="80%" height="24px" customClass="mx-auto mb-4" />
      <SkeletonLoader width="70%" height="24px" customClass="mx-auto" />
    </div>

    <!-- Navigation Skeleton -->
    <div v-if="sections.includes('navigation')" class="flex items-center justify-center flex-wrap gap-6 px-3 xl:px-15 py-8">
      <SkeletonLoader v-for="n in navItems" :key="n" width="150px" height="40px" customClass="rounded-full" />
    </div>

    <!-- Content Grid Skeleton -->
    <div v-if="sections.includes('grid')" class="px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="50%" height="40px" customClass="mx-auto mb-8" />
      <div :class="gridClasses">
        <div v-for="n in gridItems" :key="n" class="flex flex-col gap-4">
          <SkeletonLoader width="100%" height="200px" customClass="rounded-lg" />
          <SkeletonLoader width="80%" height="24px" customClass="mx-auto" />
          <SkeletonLoader width="100%" height="16px" />
          <SkeletonLoader width="90%" height="16px" />
        </div>
      </div>
    </div>

    <!-- Article/Content Skeleton -->
    <div v-if="sections.includes('article')" class="px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="70%" height="40px" customClass="mb-6" />
      <div class="space-y-4">
        <SkeletonLoader width="100%" height="20px" />
        <SkeletonLoader width="95%" height="20px" />
        <SkeletonLoader width="100%" height="20px" />
        <SkeletonLoader width="88%" height="20px" />
        <SkeletonLoader width="92%" height="20px" />
        <SkeletonLoader width="85%" height="20px" />
      </div>
    </div>

    <!-- Two Column Layout Skeleton -->
    <div v-if="sections.includes('two-column')" class="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-12 px-3 xl:px-15 py-8 xl:py-12">
      <div>
        <SkeletonLoader width="60%" height="32px" customClass="mb-4" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="95%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="90%" height="20px" />
      </div>
      <div>
        <SkeletonLoader width="60%" height="32px" customClass="mb-4" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="90%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="85%" height="20px" />
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-if="sections.includes('list')" class="px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="40%" height="32px" customClass="mb-6" />
      <div class="space-y-4">
        <div v-for="n in listItems" :key="n" class="flex gap-4 p-4 border border-gray-200 rounded-lg">
          <SkeletonLoader width="60px" height="60px" customClass="rounded-lg flex-shrink-0" />
          <div class="flex-1">
            <SkeletonLoader width="70%" height="20px" customClass="mb-2" />
            <SkeletonLoader width="100%" height="16px" customClass="mb-1" />
            <SkeletonLoader width="80%" height="16px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table/Form Skeleton -->
    <div v-if="sections.includes('table')" class="px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="40%" height="32px" customClass="mb-6" />
      <div class="space-y-3">
        <div v-for="n in tableRows" :key="n" class="grid grid-cols-3 gap-4">
          <SkeletonLoader width="100%" height="20px" />
          <SkeletonLoader width="100%" height="20px" />
          <SkeletonLoader width="100%" height="20px" />
        </div>
      </div>
    </div>

    <!-- CTA/Button Section Skeleton -->
    <div v-if="sections.includes('cta')" class="px-3 xl:px-15 py-8 text-center">
      <SkeletonLoader width="50%" height="24px" customClass="mx-auto mb-4" />
      <SkeletonLoader width="200px" height="50px" customClass="mx-auto rounded-full" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sections: {
    type: Array,
    default: () => ['hero', 'grid']
  },
  gridItems: {
    type: Number,
    default: 6
  },
  gridCols: {
    type: String,
    default: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  },
  listItems: {
    type: Number,
    default: 5
  },
  tableRows: {
    type: Number,
    default: 8
  },
  navItems: {
    type: Number,
    default: 5
  }
})

const gridClasses = computed(() => `grid ${props.gridCols} gap-6`)
</script>