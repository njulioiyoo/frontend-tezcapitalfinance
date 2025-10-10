export default defineNuxtRouteMiddleware(async (to, from) => {
  // Simple and direct approach
  try {
    // Make direct API call to check configuration
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://cms.tez-capital.web.local'
    const url = `${baseURL}/api/v1/configurations?group=join_us&_t=${Date.now()}`
    
    const response = await $fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      // Disable all caching
      server: false,
      key: `join-us-config-${Date.now()}` // Force fresh request every time
    })
    
    // Extract button_join_us_enabled value from correct structure
    const configValue = response?.data?.button_join_us_enabled?.value
    const buttonEnabled = configValue !== undefined && configValue !== null ? configValue : true
    
    // Block access if disabled
    if (!buttonEnabled) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found'
      })
    }
    
  } catch (error) {
    // If it's our intended 404, throw it
    if (error.statusCode === 404) {
      throw error
    }
    
    // For network/API errors, allow access (fail-safe)
    console.warn('join-us-guard: API error, allowing access:', error.message)
    return
  }
})