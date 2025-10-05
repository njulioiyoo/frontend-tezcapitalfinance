<template>
  <div>
    <!-- Hero Section Skeleton -->
    <div class="relative px-3 h-50 xl:h-100 flex flex-col items-center justify-center bg-gray-200">
      <SkeletonLoader width="60%" height="40px" customClass="mx-auto" />
    </div>
    
    <!-- Main Content Section -->
    <section class="py-8 xl:py-12">
      <div class="px-3 xl:px-15">
        <div class="text-center mb-6 xl:mb-12">
          <SkeletonLoader width="50%" height="40px" customClass="mb-6 xl:mb-8 mx-auto" />

          <!-- Search and Filters Skeleton -->
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8">
              <SkeletonLoader width="100%" height="48px" customClass="rounded-full" />
              <SkeletonLoader width="100%" height="48px" customClass="rounded-full" />
              <SkeletonLoader width="100%" height="48px" customClass="rounded-full" />
            </div>
          </div>
        </div>

        <!-- Job Listings Skeleton -->
        <div class="max-w-6xl mx-auto">
          <div class="space-y-0">
            <div v-for="n in itemsToShow" :key="n" class="border-b border-grey py-4">
              <div class="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8 items-start">
                <!-- Job Title Column -->
                <div class="flex flex-col">
                  <SkeletonLoader width="30%" height="16px" customClass="mb-1" />
                  <SkeletonLoader width="70%" height="20px" />
                </div>
                
                <!-- Department Column -->
                <div class="flex flex-col pl-8">
                  <SkeletonLoader width="40%" height="16px" customClass="mb-1" />
                  <SkeletonLoader width="60%" height="20px" />
                </div>
                
                <!-- Location Column -->
                <div class="flex flex-col">
                  <SkeletonLoader width="30%" height="16px" customClass="mb-1" />
                  <SkeletonLoader width="50%" height="20px" />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Skeleton -->
          <div class="flex justify-center mt-8 xl:mt-12">
            <div class="flex gap-2">
              <SkeletonLoader width="40px" height="40px" customClass="rounded-md" />
              <SkeletonLoader width="40px" height="40px" customClass="rounded-md" />
              <SkeletonLoader width="40px" height="40px" customClass="rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Props {
  itemsToShow?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsToShow: 5
})
</script>