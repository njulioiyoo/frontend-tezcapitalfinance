<template>
  <div>
    <!-- Office Info Section -->
    <div class="bg-grey px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="30%" height="40px" customClass="mb-6" />
      <div class="flex flex-col gap-4">
        <SkeletonLoader width="40%" height="28px" />
        <div class="space-y-2">
          <SkeletonLoader width="90%" height="24px" />
          <SkeletonLoader width="70%" height="24px" />
        </div>
        <div class="flex items-center gap-2">
          <SkeletonLoader width="24px" height="24px" customClass="rounded" />
          <SkeletonLoader width="150px" height="24px" />
        </div>
      </div>
    </div>

    <!-- Contact Info Section -->
    <div class="px-3 xl:px-15 py-8 xl:py-12 gap-6 xl:gap-12 flex flex-col">
      <!-- Header with Image and Title -->
      <div class="flex items-center gap-6 justify-center">
        <SkeletonLoader width="120px" height="120px" customClass="rounded-lg" />
        <div>
          <SkeletonLoader width="400px" height="28px" customClass="mb-3 xl:h-12" />
          <SkeletonLoader width="350px" height="28px" customClass="xl:h-12" />
        </div>
      </div>

      <!-- Service Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="py-6 px-5 border border-divider rounded-2xl flex flex-col items-center justify-center gap-6">
          <SkeletonLoader width="100px" height="100px" customClass="rounded-lg" />
          <SkeletonLoader width="80%" height="24px" />
        </div>
      </div>

      <!-- FAQ Accordion Section -->
      <div class="w-full space-y-4">
        <div v-for="n in 4" :key="n" class="border border-gray-200 rounded-lg">
          <div class="p-4 flex items-center justify-between">
            <SkeletonLoader width="85%" height="20px" />
            <SkeletonLoader width="20px" height="20px" customClass="rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>