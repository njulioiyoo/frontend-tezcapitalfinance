export interface LanguageConfig {
  bilingual_enabled: boolean
  default_language: 'id' | 'en'
  language_switcher_enabled: boolean
  auto_detect_language: boolean
}

export const useLanguageConfig = () => {
  const languageConfig = ref<LanguageConfig>({
    bilingual_enabled: true,
    default_language: 'id',
    language_switcher_enabled: true,
    auto_detect_language: false
  })

  const isLoading = ref(true)
  const error = ref<any>(null)

  // Get browser language
  const getBrowserLanguage = (): 'id' | 'en' => {
    if (process.client) {
      const browserLang = navigator.language || navigator.languages?.[0] || 'id'
      const lang = browserLang.toLowerCase()
      
      // Map common Indonesian language codes
      if (lang.includes('id') || lang.includes('indonesia')) {
        return 'id'
      }
      
      // Default to English for other languages
      if (lang.includes('en') || lang.includes('english')) {
        return 'en'
      }
      
      // Default to Indonesian if unknown
      return 'id'
    }
    return 'id'
  }

  // Fetch language configuration from API using cache
  const fetchLanguageConfig = async () => {
    try {
      isLoading.value = true
      error.value = null

      const { getLanguageConfig } = useConfigurationCache()
      const langConfig = await getLanguageConfig()
      
      languageConfig.value = {
        bilingual_enabled: langConfig.bilingual_enabled?.value ?? true,
        default_language: langConfig.default_language?.value ?? 'id',
        language_switcher_enabled: langConfig.language_switcher_enabled?.value ?? true,
        auto_detect_language: langConfig.auto_detect_language?.value ?? false
      }
    } catch (err) {
      console.error('Failed to fetch language config:', err)
      error.value = err
      
      // Use fallback values on error
      languageConfig.value = {
        bilingual_enabled: true,
        default_language: 'id',
        language_switcher_enabled: true,
        auto_detect_language: false
      }
    } finally {
      isLoading.value = false
    }
  }

  // Get initial language based on config
  const getInitialLanguage = (): 'id' | 'en' => {
    // If auto detect is enabled and we're in browser
    if (languageConfig.value.auto_detect_language && process.client) {
      const browserLang = getBrowserLanguage()
      
      // Only use browser language if it's different from default and bilingual is enabled
      if (languageConfig.value.bilingual_enabled && browserLang !== languageConfig.value.default_language) {
        return browserLang
      }
    }
    
    // Otherwise use default language from config
    return languageConfig.value.default_language
  }

  // Check if language switching is allowed
  const canSwitchLanguage = computed(() => {
    return languageConfig.value.bilingual_enabled && languageConfig.value.language_switcher_enabled
  })

  // Get available languages
  const availableLanguages = computed(() => {
    if (!languageConfig.value.bilingual_enabled) {
      return [languageConfig.value.default_language]
    }
    return ['id', 'en'] as const
  })

  return {
    languageConfig: readonly(languageConfig),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchLanguageConfig,
    getInitialLanguage,
    canSwitchLanguage,
    availableLanguages,
    getBrowserLanguage
  }
}