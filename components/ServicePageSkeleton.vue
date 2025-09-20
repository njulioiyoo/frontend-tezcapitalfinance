<template>
  <div class="px-3 xl:px-15 py-8 xl:py-12">
    <!-- Services List Skeleton -->
    <div class="flex flex-col divide-y divide-divider">
      <div v-for="n in 3" :key="n" class="flex flex-col xl:flex-row gap-6 items-center py-6 xl:py-9">
        <!-- Service Image Skeleton -->
        <SkeletonLoader width="150px" height="150px" customClass="xl:w-37.5 xl:h-37.5 rounded-lg" />
        
        <!-- Service Content Skeleton -->
        <div class="flex flex-col gap-6 flex-1">
          <!-- Service Title -->
          <SkeletonLoader width="60%" height="32px" customClass="xl:text-left mx-auto xl:mx-0" />
          
          <!-- Service Description -->
          <div class="space-y-2">
            <SkeletonLoader width="100%" height="20px" />
            <SkeletonLoader width="90%" height="20px" />
            <SkeletonLoader width="80%" height="20px" />
          </div>
          
          <!-- View Detail Link -->
          <div class="flex items-center justify-center xl:justify-end gap-2">
            <SkeletonLoader width="80px" height="20px" />
            <SkeletonLoader width="20px" height="20px" customClass="rounded" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination Skeleton -->
    <div class="mt-6">
      <div class="mx-auto flex w-full justify-end">
        <div class="flex items-center gap-1">
          <!-- Previous Button Skeleton -->
          <SkeletonLoader width="90px" height="40px" customClass="rounded-md" />
          <!-- Page Number Skeletons -->
          <SkeletonLoader v-for="n in 3" :key="n" width="40px" height="40px" customClass="rounded-md" />
          <!-- Next Button Skeleton -->
          <SkeletonLoader width="70px" height="40px" customClass="rounded-md" />
        </div>
      </div>
    </div>
  </div>
</template>