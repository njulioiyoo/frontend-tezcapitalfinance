<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "Jumbotron",
    required: true,
  },
  img: {
    type: String,
    default: null,
    required: true,
  },
  desc: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div
    class="relative px-3 h-50 xl:h-100 flex flex-col items-center justify-center bg-red-100 overflow-hidden"
  >
    <img
      :src="props.img"
      :alt="props.label"
      class="absolute inset-0 w-full h-full object-cover opacity-70 object-center"
    />
    <div class="absolute inset-0 bg-red-100/65 mix-blend-multiply"></div>
    <h1 class="relative z-10 text-white xl:text-5xl text-2xl font-bold">
      {{ props.label }}
    </h1>
    <h3
      v-if="props.desc"
      class="relative z-10 text-white text-2xl xl:text-4xl mt-4 text-center"
      v-html="props.desc"
    />
  </div>
</template>
