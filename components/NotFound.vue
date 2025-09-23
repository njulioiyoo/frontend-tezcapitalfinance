<template>
    <div class="!h-[calc(100dvh_-_426px)] flex flex-col justify-center items-center">
        <h1 class="font-bold text-red-100 text-9xl mb-6">{{ $t('notFound.title') }}</h1>
        <p class="text-4xl text-black-100 mb-12">{{ $t('notFound.subtitle') }}</p>
        <NuxtLink to="/" class="text-xl text-red-100 underline">{{ $t('notFound.backToHome') }}</NuxtLink>
    </div>
</template>