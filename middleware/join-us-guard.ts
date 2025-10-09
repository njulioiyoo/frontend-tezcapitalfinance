export default defineNuxtRouteMiddleware(async (to, from) => {
  // Simple and direct approach
  try {
    // Make direct API call to check configuration
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://cms.tez-capital.web.local'
    const url = `${baseURL}/api/v1/configurations?group=join_us`
    
    const response = await $fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
    
    // Extract button_join_us_enabled value
    const joinUsConfig = response?.data?.join_us || response?.join_us
    const buttonEnabled = joinUsConfig?.button_join_us_enabled?.value ?? true
    
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