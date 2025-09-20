<template>
  <div>
    <!-- Hero/Gallery Section -->
    <div class="relative">
      <SkeletonLoader width="100%" height="400px" customClass="xl:h-200" />
      <div class="flex items-center justify-between absolute top-1/2 left-1/2 -translate-1/2 z-10 w-[calc(100%_-_48px)]">
        <SkeletonLoader width="48px" height="48px" customClass="rounded-full" />
        <SkeletonLoader width="48px" height="48px" customClass="rounded-full" />
      </div>
    </div>

    <!-- Navigation Buttons Section -->
    <div class="flex items-center justify-center flex-wrap gap-6 bg-red-100 px-3 xl:px-20 py-8 xl:py-12">
      <SkeletonLoader v-for="n in 5" :key="n" width="200px" height="60px" customClass="rounded-full" />
    </div>

    <!-- Six Reasons Section -->
    <div class="flex flex-col gap-6 xl:gap-9 py-8 xl:py-12">
      <SkeletonLoader width="60%" height="48px" customClass="mx-auto" />
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-3 xl:px-15">
        <div v-for="n in 6" :key="n" class="w-full max-w-100 mx-auto bg-black-50 rounded-2xl p-5 flex flex-col gap-5">
          <SkeletonLoader width="100%" height="200px" customClass="rounded-lg" />
          <div class="h-14 flex items-center justify-center">
            <SkeletonLoader width="80%" height="24px" />
          </div>
          <div class="bg-grey/30 p-4 rounded-xl h-32 flex items-center">
            <div class="w-full">
              <SkeletonLoader width="100%" height="16px" customClass="mb-2" />
              <SkeletonLoader width="90%" height="16px" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="py-8 xl:py-12">
      <div class="bg-divider h-0.25 w-full px-15"></div>
    </div>

    <!-- Our Services Section -->
    <div class="flex flex-col xl:gap-9 gap-6 py-8 xl:py-12">
      <SkeletonLoader width="40%" height="48px" customClass="mx-auto" />
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-15">
        <div v-for="n in 3" :key="n" class="transition-all duration-700">
          <div class="w-full max-w-100 mx-auto rounded-2xl p-3 flex flex-col gap-5 bg-white">
            <SkeletonLoader width="100%" height="172px" customClass="rounded-lg" />
            <div class="p-3 rounded-xl flex flex-col gap-2 items-center justify-center h-auto xl:h-35 bg-white/50">
              <SkeletonLoader width="70%" height="24px" />
              <SkeletonLoader width="90%" height="16px" />
            </div>
          </div>
        </div>
      </div>
      <SkeletonLoader width="200px" height="60px" customClass="rounded-full mx-auto" />
    </div>

    <!-- Application Process Section -->
    <div class="flex flex-col xl:gap-9 gap-6 py-8 xl:py-12 bg-grey">
      <SkeletonLoader width="50%" height="48px" customClass="mx-auto" />
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-12 px-3 xl:px-15 relative">
        <div v-for="n in 5" :key="n" class="flex flex-col gap-3 xl:gap-7 items-center">
          <SkeletonLoader width="60px" height="32px" customClass="xl:h-12" />
          <div class="xl:size-48 size-28 p-6 xl:p-10 bg-black-50 rounded-full flex items-center justify-center relative z-10">
            <SkeletonLoader width="100%" height="100%" customClass="rounded-full" />
          </div>
          <SkeletonLoader width="80%" height="16px" />
        </div>
      </div>
      <SkeletonLoader width="200px" height="60px" customClass="rounded-full mx-auto" />
    </div>

    <!-- Our Partners Section -->
    <div class="flex flex-col xl:gap-9 gap-6 py-8 xl:py-12">
      <SkeletonLoader width="40%" height="48px" customClass="mx-auto" />
      <div class="flex flex-wrap justify-center gap-6 px-3 xl:px-15">
        <SkeletonLoader v-for="n in 9" :key="n" width="150px" height="100px" customClass="rounded-lg" />
      </div>
    </div>

    <!-- Divider -->
    <div class="py-8 xl:py-12">
      <div class="bg-divider h-0.25 w-full px-15"></div>
    </div>

    <!-- News Updates Section -->
    <div class="py-8 xl:py-12">
      <div class="xl:px-15 px-3">
        <div class="flex justify-between items-end pb-5 mb-6 xl:mb-12 border-b border-b-divider">
          <SkeletonLoader width="40%" height="48px" />
          <SkeletonLoader width="150px" height="24px" />
        </div>
        <ul class="flex flex-col gap-4 xl:gap-5">
          <li v-for="n in 4" :key="n">
            <div class="flex flex-col gap-1 pb-5 border-b border-b-divider">
              <SkeletonLoader width="200px" height="16px" />
              <SkeletonLoader width="90%" height="32px" customClass="xl:h-12" />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="py-8 xl:py-12 px-3 xl:px-15">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-12">
        <div class="grid grid-cols-2 xl:grid-cols-1 gap-3 items-center">
          <SkeletonLoader width="200px" height="200px" customClass="xl:size-50 size-25 mx-auto rounded-lg" />
          <SkeletonLoader width="100%" height="48px" customClass="xl:text-5xl text-2xl" />
        </div>
        <div class="flex flex-col gap-6 xl:gap-12 col-span-2">
          <div class="w-full">
            <div v-for="n in 5" :key="n" class="border-b border-gray-200 py-4">
              <SkeletonLoader width="90%" height="24px" customClass="mb-2" />
              <SkeletonLoader width="70%" height="16px" />
            </div>
          </div>
          <SkeletonLoader width="200px" height="60px" customClass="rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>