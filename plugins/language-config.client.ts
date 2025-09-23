export default defineNuxtPlugin(async () => {
  // Initialize language configuration on app startup
  const { fetchLanguageConfig } = useLanguageConfig()
  
  try {
    await fetchLanguageConfig()
  } catch (error) {
  }
})