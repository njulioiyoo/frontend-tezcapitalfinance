export default defineNuxtPlugin(() => {
  console.log('🔧 Configuration plugin starting...')
  
  // Skip on server side
  if (process.server) {
    console.log('🔧 Skipping configuration setup on server side')
    return
  }

  console.log('🔧 Configuration plugin running on client side')
  
  // Use nextTick to ensure everything is ready
  nextTick(async () => {
    try {
      console.log('🔧 Starting configuration setup...')
      
      // Get config directly without using stores/composables to avoid plugin issues
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl
      
      console.log('🔧 API Base URL:', baseURL)
      
      if (!baseURL) {
        console.warn('⚠️ No API base URL configured')
        return
      }
      
      // Direct fetch to avoid store/composable issues in plugin
      const url = `${baseURL}/api/v1/configurations?_t=${Date.now()}`
      console.log('🔧 Fetching configuration:', url)
      
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
      
      console.log('🔧 Configuration API response:', response)
      
      // Handle response structure
      let data = response
      if (response && typeof response === 'object') {
        if (response.data) {
          data = response.data
        } else if (response.success && response.data) {
          data = response.data
        }
      }
      
      console.log('🔧 Processed configuration data:', data)
      
      // Extract app name and description
      const appName = data?.general?.app_name?.value || data?.general?.app_name || ''
      const appDescription = data?.general?.app_description?.value || data?.general?.app_description || ''
      
      console.log('🔧 App name from config:', appName)
      console.log('🔧 App description from config:', appDescription)
      
      // Update document title only if data exists
      if (appName && appName.trim() !== '') {
        document.title = appName
        console.log('🔧 Updated document title to:', document.title)
      } else {
        console.log('🔧 No app name from API, keeping default title')
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
        console.log('🔧 Updated meta description to:', appDescription)
      } else {
        console.log('🔧 No app description from API, keeping default meta')
      }
      
    } catch (error: any) {
      console.error('🔧 Configuration setup error:', error)
      
      // Handle specific API errors
      if (error.message && error.message.includes('Unexpected token')) {
        console.warn('⚠️ API returned HTML instead of JSON')
      } else if (error.message && error.message.includes('fetch')) {
        console.warn('⚠️ Network error accessing API')
      }
    }
  })
})