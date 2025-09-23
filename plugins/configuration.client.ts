export default defineNuxtPlugin(() => {
  
  // Skip on server side
  if (process.server) {
    return
  }

  
  // Use nextTick to ensure everything is ready
  nextTick(async () => {
    try {
      
      // Get config directly without using stores/composables to avoid plugin issues
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl
      
      
      if (!baseURL) {
        return
      }
      
      // Direct fetch to avoid store/composable issues in plugin
      const url = `${baseURL}/api/v1/configurations?_t=${Date.now()}`
      
      const response = await $fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        server: false,
        default: () => null
      })
      
      
      // Handle response structure
      let data = response
      if (response && typeof response === 'object') {
        if (response.data) {
          data = response.data
        } else if (response.success && response.data) {
          data = response.data
        }
      }
      
      
      // Extract app name and description
      const appName = data?.general?.app_name?.value || data?.general?.app_name || ''
      const appDescription = data?.general?.app_description?.value || data?.general?.app_description || ''
      
      
      // Update document title only if data exists
      if (appName && appName.trim() !== '') {
        document.title = appName
      } else {
      }
      
      // Update meta description only if data exists
      if (appDescription && appDescription.trim() !== '') {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', appDescription)
        } else {
          // Create meta description if it doesn't exist
          const meta = document.createElement('meta')
          meta.name = 'description'
          meta.content = appDescription
          document.head.appendChild(meta)
        }
      } else {
      }
      
    } catch (error: any) {
      
      // Handle specific API errors
      if (error.message && error.message.includes('Unexpected token')) {
      } else if (error.message && error.message.includes('fetch')) {
      }
    }
  })
})