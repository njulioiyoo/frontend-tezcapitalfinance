<template>
  <div>
    <!-- Hero Section Skeleton -->
    <div class="relative px-3 h-50 xl:h-100 flex flex-col items-center justify-center bg-gray-200">
      <SkeletonLoader width="60%" height="40px" customClass="mx-auto" />
    </div>

    <!-- CEO Message Section Skeleton -->
    <div class="px-3 xl:px-15 py-12 xl:py-16">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-16 items-center">
          <div class="order-2 xl:order-1">
            <SkeletonLoader width="40%" height="40px" customClass="mb-8 xl:mb-10" />
            <div class="space-y-6">
              <SkeletonLoader width="100%" height="20px" />
              <SkeletonLoader width="95%" height="20px" />
              <SkeletonLoader width="100%" height="20px" />
              <SkeletonLoader width="90%" height="20px" />
              <SkeletonLoader width="85%" height="20px" />
              <SkeletonLoader width="100%" height="20px" />
              <SkeletonLoader width="95%" height="20px" />
              <SkeletonLoader width="80%" height="20px" />
            </div>
          </div>
          <div class="order-1 xl:order-2 flex justify-center">
            <SkeletonLoader width="320px" height="384px" customClass="rounded-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Separator Line -->
    <div class="px-3 xl:px-15">
      <div class="border-t border-gray-300 my-8 xl:my-12"></div>
    </div>

    <!-- Get to Know Our Work Section Skeleton -->
    <div class="px-3 xl:px-15 py-16 xl:py-20">
      <div class="max-w-7xl mx-auto">
        <SkeletonLoader width="50%" height="40px" customClass="mb-12 xl:mb-16 mx-auto" />
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-12 px-15">
          <div v-for="n in 3" :key="n" class="transition-all duration-300">
            <div class="w-full max-w-100 mx-auto rounded-2xl p-3 flex flex-col gap-5">
              <SkeletonLoader width="100%" height="172px" customClass="rounded-lg" />
              <div class="p-3 rounded-xl flex flex-col gap-2 items-center justify-center h-auto xl:h-35">
                <SkeletonLoader width="80%" height="24px" customClass="mx-auto" />
                <SkeletonLoader width="100%" height="16px" customClass="mx-auto mb-1" />
                <SkeletonLoader width="90%" height="16px" customClass="mx-auto" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-12 xl:mt-16">
          <SkeletonLoader width="200px" height="48px" customClass="rounded-full" />
        </div>
      </div>
    </div>

    <!-- Separator Line -->
    <div class="px-3 xl:px-15">
      <div class="border-t border-gray-300 my-8 xl:my-12"></div>
    </div>

    <!-- Meet Our People Section Skeleton -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="40%" height="32px" customClass="mb-8 xl:mb-12 mx-auto" />
      
      <div class="relative">
        <div class="overflow-x-auto">
          <div class="flex gap-6 xl:gap-8 pb-4">
            <div v-for="n in 5" :key="n" class="flex-shrink-0 w-72 xl:w-80">
              <div class="flex flex-col items-start text-left">
                <SkeletonLoader width="100%" height="320px" customClass="xl:h-96 rounded-lg mb-4" />
                <SkeletonLoader width="60%" height="24px" customClass="mb-2" />
                <SkeletonLoader width="80%" height="16px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explore Our Workplace Section Skeleton -->
    <div class="bg-grey px-3 xl:px-15 py-8 xl:py-12">
      <SkeletonLoader width="50%" height="32px" customClass="mb-8 xl:mb-12 mx-auto" />
      
      <!-- Static 2 Cards Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        <div v-for="n in 2" :key="n" class="bg-white rounded-2xl overflow-hidden shadow-lg">
          <SkeletonLoader width="100%" height="256px" />
          <div class="p-6">
            <SkeletonLoader width="75%" height="24px" customClass="mb-4 mx-auto" />
            <SkeletonLoader width="100%" height="16px" customClass="mb-2" />
            <SkeletonLoader width="90%" height="16px" customClass="mx-auto" />
          </div>
        </div>
      </div>

      <!-- Working Environment Cards Skeleton -->
      <div class="mt-16">
        <SkeletonLoader width="25%" height="32px" customClass="mb-12 mx-auto" />
        <!-- Mobile: Horizontal Scroll -->
        <div class="overflow-x-auto md:hidden scrollbar-hide mx-auto" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 896px; max-width: 100%;">
          <div class="flex gap-4 px-4 pb-2" style="width: max-content;">
            <div v-for="n in 6" :key="n" class="flex-shrink-0 w-72 text-center">
              <SkeletonLoader width="100%" height="176px" customClass="rounded-2xl mb-4" />
              <SkeletonLoader width="75%" height="16px" customClass="mx-auto" />
            </div>
          </div>
        </div>
        <!-- Desktop: Horizontal Slider -->
        <div class="hidden md:block">
          <div class="overflow-x-auto scrollbar-hide mx-auto" style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 1248px; max-width: 100%;">
            <div class="flex gap-8 px-4 pb-2" style="width: max-content;">
              <div v-for="n in 6" :key="n" class="flex-shrink-0 w-96 text-center">
                <SkeletonLoader width="100%" height="208px" customClass="rounded-2xl mb-4" />
                <SkeletonLoader width="75%" height="16px" customClass="mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Separator Line within same background -->
      <div class="border-t border-gray-300 my-8 xl:my-12"></div>
      
      <!-- Be a Part of Our Team Section Skeleton -->
      <SkeletonLoader width="50%" height="32px" customClass="mb-8 xl:mb-12 mx-auto" />
      
      <!-- Search and Filters Skeleton -->
      <div class="mb-8 xl:mb-12">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr] gap-6 xl:gap-8">
            <SkeletonLoader width="100%" height="48px" customClass="rounded-full" />
            <SkeletonLoader width="100%" height="48px" customClass="rounded-full" />
            <SkeletonLoader width="100%" height="48px" customClass="rounded-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Job Listings Section Skeleton -->
    <div class="px-3 xl:px-15 py-8 xl:py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Job Listings Skeleton -->
        <div class="mb-8 xl:mb-12">
          <div class="space-y-0">
            <div v-for="n in 4" :key="n" class="border-b border-grey py-4">
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
        </div>

        <!-- See All Jobs Button Skeleton -->
        <div class="flex justify-center">
          <SkeletonLoader width="150px" height="48px" customClass="rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>