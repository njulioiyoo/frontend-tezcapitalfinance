<script setup lang="ts">
interface Props {
  contentId: number
  contentTitle: string
  initialLikeCount?: number
  initialShareCount?: number
  initialViewCount?: number
  showCounts?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  initialLikeCount: 0,
  initialShareCount: 0,
  initialViewCount: 0,
  showCounts: true,
  size: 'md'
})

const { likeContent, shareContentNative, isLoading, error } = useEngagement()

// Local state for counts
const likeCount = ref(props.initialLikeCount)
const shareCount = ref(props.initialShareCount)
const viewCount = ref(props.initialViewCount)

// Track user interactions (local storage to prevent duplicate likes)
const hasLiked = ref(false)

// Check if user has already liked this content
onMounted(() => {
  if (process.client) {
    const liked = localStorage.getItem(`liked_content_${props.contentId}`)
    hasLiked.value = liked === 'true'
  }
})

// Handle like action
const handleLike = async () => {
  if (hasLiked.value || isLoading.value) return

  try {
    const result = await likeContent(props.contentId)
    if (result.success) {
      likeCount.value = result.data.like_count
      hasLiked.value = true
      
      // Store in localStorage to prevent duplicate likes
      if (process.client) {
        localStorage.setItem(`liked_content_${props.contentId}`, 'true')
      }
    }
  } catch (err) {
    console.error('Failed to like content:', err)
  }
}

// Handle share action
const handleShare = async () => {
  if (isLoading.value) return

  try {
    const shareData = {
      id: props.contentId,
      title: props.contentTitle,
      text: `Check out this article: ${props.contentTitle}`,
      url: window.location.href
    }

    const result = await shareContentNative(shareData)
    
    if (result.success) {
      shareCount.value += 1
      
      // Show different feedback based on share method
      if (result.method === 'clipboard') {
        // You could show a toast notification here
        console.log('Link copied to clipboard!')
      } else if (result.method === 'fallback') {
        // Show social media options
        console.log('Share options available:', result.options)
      }
    }
  } catch (err) {
    console.error('Failed to share content:', err)
  }
}

// Dynamic classes based on size prop
const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 border'
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]}`
})

const iconClasses = computed(() => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  return sizeClasses[props.size]
})
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Like Button -->
    <button
      :class="[
        buttonClasses,
        hasLiked
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
      ]"
      :disabled="isLoading || hasLiked"
      @click="handleLike"
    >
      <!-- Heart Icon -->
      <svg 
        :class="[iconClasses, hasLiked ? 'fill-red-500' : 'fill-none']" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      
      <span v-if="showCounts">{{ likeCount }}</span>
      <span v-else>{{ hasLiked ? 'Liked' : 'Like' }}</span>
    </button>

    <!-- Share Button -->
    <button
      :class="[
        buttonClasses,
        'bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
      ]"
      :disabled="isLoading"
      @click="handleShare"
    >
      <!-- Share Icon -->
      <svg 
        :class="iconClasses" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      
      <span v-if="showCounts">{{ shareCount }}</span>
      <span v-else>Share</span>
    </button>

    <!-- View Count (Read-only) -->
    <div 
      v-if="showCounts && viewCount > 0"
      :class="[
        buttonClasses.replace('border', 'border-transparent'),
        'bg-transparent text-gray-500 cursor-default'
      ]"
    >
      <!-- Eye Icon -->
      <svg 
        :class="iconClasses" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      
      <span>{{ viewCount }}</span>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="flex items-center gap-1 text-xs text-gray-400">
      <svg class="w-3 h-3 animate-spin" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
        <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>
  </div>
</template>