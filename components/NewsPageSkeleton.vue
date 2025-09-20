<template>
  <div>
    <!-- Highlights Section Skeleton -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="200px" height="48px" customClass="mb-6 xl:mb-9" />
      
      <!-- Swiper Skeleton -->
      <div class="shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
        <SkeletonLoader width="100%" height="300px" customClass="rounded-t-3xl" />
        <div class="gap-6 p-4 xl:p-6">
          <SkeletonLoader width="250px" height="20px" customClass="mb-1 xl:mb-3" />
          <div class="flex justify-between items-center gap-3">
            <SkeletonLoader width="60%" height="28px" />
            <div class="flex items-center gap-2">
              <SkeletonLoader width="100px" height="20px" />
              <SkeletonLoader width="20px" height="20px" customClass="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section Skeleton -->
    <div class="px-3 xl:px-15 pb-8 xl:pb-12">
      <!-- Tabs Skeleton -->
      <div class="w-full mt-3 xl:mt-12">
        <!-- Tab Buttons Skeleton -->
        <div class="flex gap-2 mb-5">
          <SkeletonLoader v-for="n in 4" :key="n" width="120px" height="40px" customClass="rounded-lg" />
        </div>

        <!-- Search and Filter Section Skeleton -->
        <div class="flex justify-between flex-col lg:flex-row mt-5 gap-6">
          <div class="flex flex-col gap-2 order-2 lg:order-1">
            <SkeletonLoader width="250px" height="32px" customClass="font-bold" />
            <SkeletonLoader width="350px" height="24px" />
          </div>
          <div class="flex gap-4 h-fit items-center order-1 lg:order-2">
            <div class="relative h-fit w-full items-center">
              <SkeletonLoader width="200px" height="40px" customClass="rounded-lg" />
            </div>
            <div class="flex items-center gap-2 h-fit">
              <SkeletonLoader width="80px" height="40px" customClass="rounded-lg" />
            </div>
          </div>
        </div>

        <!-- News List Content Skeleton -->
        <div class="xl:mt-6 space-y-4 mt-0">
          <div v-for="n in 5" :key="n" class="flex justify-between items-end gap-6 py-5 border-b border-b-divider">
            <div class="flex flex-col gap-1">
              <SkeletonLoader width="280px" height="16px" />
              <SkeletonLoader width="85%" height="32px" />
            </div>
            <div class="flex items-center gap-2 !min-w-fit">
              <SkeletonLoader width="100px" height="20px" />
              <SkeletonLoader width="20px" height="20px" customClass="rounded" />
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
    </div>
  </div>
</template>