<template>
  <div class="text-center team-member-card">
    <div class="relative mb-4 overflow-hidden rounded-lg">
      <img 
        :src="member.image" 
        :alt="member.name"
        class="w-full h-64 object-cover"
        @error="handleImageError"
      />
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-900 mb-1">
        {{ member.name }}
      </h3>
      <p class="text-sm text-gray-600">
        {{ member.position }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeamMember {
  id: number
  name: string
  position: string
  image: string
}

interface Props {
  member: TeamMember
}

const props = defineProps<Props>()
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/img/placeholder-team.jpg'
}
</script>