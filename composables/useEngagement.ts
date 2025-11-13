export const useEngagement = () => {
  const apiStore = useApiStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Track like action
  const likeContent = async (contentId: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch(`${apiStore.baseURL}/api/v1/content/${contentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to like content')
      }

      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to like content'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Track share action
  const shareContent = async (contentId: number) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch(`${apiStore.baseURL}/api/v1/content/${contentId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to share content')
      }

      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to share content'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Share content via Web Share API or fallback
  const shareContentNative = async (content: {
    id: number
    title: string
    url?: string
    text?: string
  }) => {
    const shareData = {
      title: content.title,
      text: content.text || `Check out this article: ${content.title}`,
      url: content.url || window.location.href,
    }

    try {
      // Try Web Share API first (mobile browsers)
      if (navigator.share) {
        await navigator.share(shareData)
        // Track the share
        await shareContent(content.id)
        return { success: true, method: 'native' }
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url || window.location.href)
        // Track the share
        await shareContent(content.id)
        return { success: true, method: 'clipboard' }
      }
    } catch (err: any) {
      // Additional fallback methods
      if (err.name !== 'AbortError') {
        // Try different share options
        const url = shareData.url || window.location.href
        
        // Try opening social media share dialogs
        const shareOptions = [
          {
            name: 'Twitter',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text || '')}&url=${encodeURIComponent(url)}`
          },
          {
            name: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          },
          {
            name: 'WhatsApp',
            url: `https://wa.me/?text=${encodeURIComponent((shareData.text || '') + ' ' + url)}`
          }
        ]

        // Track the share attempt
        await shareContent(content.id)
        
        return { success: true, method: 'fallback', options: shareOptions }
      }
      throw err
    }
  }

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    likeContent,
    shareContent,
    shareContentNative,
  }
}