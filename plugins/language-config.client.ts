export default defineNuxtPlugin(async () => {
  // Initialize language configuration on app startup
  const { fetchLanguageConfig } = useLanguageConfig()
  
  try {
    await fetchLanguageConfig()
  } catch (error) {
    console.warn('Failed to load language configuration, using defaults:', error)
  }
})