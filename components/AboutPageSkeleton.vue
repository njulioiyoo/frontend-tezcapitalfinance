<template>
  <div>
    <!-- Navigation Anchor Section -->
    <div class="lg:flex items-center justify-around border-b border-b-red-100 hidden">
      <SkeletonLoader v-for="n in 2" :key="n" width="120px" height="20px" customClass="my-9" />
    </div>

    <!-- Our Story Section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 px-3 xl:px-15 py-8 xl:py-12 gap-6" id="our-story">
      <div class="col-span-2">
        <SkeletonLoader width="60%" height="40px" customClass="mb-5" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="90%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="85%" height="20px" />
      </div>
      <SkeletonLoader width="100%" height="310px" customClass="rounded-lg" />
    </div>

    <!-- Vision & Mission Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 px-3 xl:px-15 xl:py-12 py-8 gap-6 xl:gap-12">
      <div>
        <SkeletonLoader width="30%" height="40px" customClass="mb-5" />
        <div class="border-b border-b-gray-200 mb-5"></div>
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="95%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="100%" height="20px" customClass="mb-3" />
        <SkeletonLoader width="80%" height="20px" />
      </div>
      <div>
        <SkeletonLoader width="30%" height="40px" customClass="mb-5" />
        <div class="border-b border-b-gray-200 mb-5"></div>
        <div class="ps-6">
          <SkeletonLoader width="95%" height="20px" customClass="mb-3" />
          <SkeletonLoader width="60%" height="20px" customClass="mb-3" />
          <SkeletonLoader width="90%" height="20px" customClass="mb-3" />
          <SkeletonLoader width="85%" height="20px" />
        </div>
      </div>
    </div>

    <!-- F.A.S.T & I.D.C Values Section -->
    <div class="bg-grey py-8 xl:py-15 px-3 xl:px-15">
      <div class="flex flex-col mb-12">
        <SkeletonLoader width="70%" height="24px" customClass="mx-auto mb-2" />
        <SkeletonLoader width="50%" height="24px" customClass="mx-auto" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="flex flex-col gap-2 xl:gap-4">
          <SkeletonLoader width="150px" height="150px" customClass="mx-auto rounded-lg" />
          <SkeletonLoader width="80%" height="24px" customClass="mx-auto" />
          <SkeletonLoader width="100%" height="16px" customClass="mx-auto mb-2" />
          <SkeletonLoader width="90%" height="16px" customClass="mx-auto" />
        </div>
      </div>
      <div class="xl:py-12 py-8">
        <div class="bg-divider h-0.25 w-full"></div>
      </div>
      <div class="flex flex-col mb-12">
        <SkeletonLoader width="80%" height="24px" customClass="mx-auto mb-2" />
        <SkeletonLoader width="40%" height="24px" customClass="mx-auto" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="flex flex-col gap-2 xl:gap-4">
          <SkeletonLoader width="150px" height="150px" customClass="mx-auto rounded-lg" />
          <SkeletonLoader width="70%" height="24px" customClass="mx-auto" />
          <SkeletonLoader width="100%" height="16px" customClass="mx-auto mb-2" />
          <SkeletonLoader width="85%" height="16px" customClass="mx-auto" />
        </div>
      </div>
    </div>

    <!-- Logo Philosophy Section -->
    <div class="xl:py-12 py-8 px-3 xl:px-15" id="logo-philosophy">
      <SkeletonLoader width="50%" height="40px" customClass="mx-auto mb-6 xl:mb-9" />
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-12">
        <SkeletonLoader width="100%" height="200px" customClass="rounded-lg" />
        <div class="ps-6">
          <SkeletonLoader width="100%" height="20px" customClass="mb-5" />
          <div class="border-b border-b-gray-200 mb-5"></div>
          <SkeletonLoader width="90%" height="20px" customClass="mb-5" />
          <div class="border-b border-b-gray-200 mb-5"></div>
          <SkeletonLoader width="80%" height="20px" />
        </div>
      </div>
      <div class="xl:py-12 py-8">
        <div class="bg-divider h-0.25 w-full px-3 xl:px-15"></div>
      </div>
      <div class="text-center">
        <SkeletonLoader width="90%" height="16px" customClass="mx-auto mb-2" />
        <SkeletonLoader width="85%" height="16px" customClass="mx-auto mb-2" />
        <SkeletonLoader width="80%" height="16px" customClass="mx-auto" />
      </div>
    </div>

    <!-- Closing Statement Section -->
    <div class="xl:py-12 py-8 px-3 xl:px-15 text-center">
      <SkeletonLoader width="80%" height="24px" customClass="mx-auto mb-2" />
      <SkeletonLoader width="70%" height="24px" customClass="mx-auto mb-2" />
      <SkeletonLoader width="60%" height="24px" customClass="mx-auto" />
    </div>

  </div>
</template>