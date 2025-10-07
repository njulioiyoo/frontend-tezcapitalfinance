<template>
    <div class="min-h-[calc(100dvh_-_426px)] flex flex-col justify-center items-center px-4 py-8">
        <div class="text-center max-w-2xl mx-auto">
            <!-- 404 Number -->
            <h1 class="font-bold text-red-100 text-6xl sm:text-7xl md:text-8xl xl:text-9xl mb-4 sm:mb-6">
                {{ $t('notFound.title') }}
            </h1>
            
            <!-- Subtitle -->
            <p class="text-lg sm:text-xl md:text-2xl xl:text-4xl text-black-100 mb-8 sm:mb-12 leading-relaxed">
                {{ $t('notFound.subtitle') }}
            </p>
            
            <!-- Back to Home Button -->
            <NuxtLink 
                to="/" 
                class="inline-block bg-red-100 hover:bg-red-200 text-white font-medium py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors duration-200 text-base sm:text-lg xl:text-xl"
            >
                {{ $t('notFound.backToHome') }}
            </NuxtLink>
        </div>
    </div>
</template>