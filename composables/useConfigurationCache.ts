// Global configuration cache to prevent duplicate API calls
export interface CachedConfigurationData {
  language?: any
  maintenance?: any
  banners?: any
  [key: string]: any
}

// Global state for configuration cache
const configurationCache = ref<CachedConfigurationData | null>(null)
const isConfigLoading = ref(false)
const configError = ref<any>(null)
const lastFetchTime = ref<number>(0)

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export const useConfigurationCache = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl || 'http://cms.tez-capital.web.local'

  // Check if cache is valid
  const isCacheValid = computed(() => {
    if (!configurationCache.value || !lastFetchTime.value) return false
    return Date.now() - lastFetchTime.value < CACHE_DURATION
  })

  // Fetch configurations with deduplication
  const fetchConfigurations = async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid.value && configurationCache.value) {
      return configurationCache.value
    }

    // If already loading, wait for existing request
    if (isConfigLoading.value) {
      return new Promise((resolve, reject) => {
        const checkLoading = () => {
          if (!isConfigLoading.value) {
            if (configError.value) {
              reject(configError.value)
            } else {
              resolve(configurationCache.value)
            }
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }

    try {
      isConfigLoading.value = true
      configError.value = null

      const url = `${baseURL}/api/v1/configurations?_t=${Date.now()}`
      console.log('🔄 Fetching configurations from:', url)
      
      const response = await $fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        server: false
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

      configurationCache.value = data
      lastFetchTime.value = Date.now()
      
      console.log('✅ Configurations cached successfully')
      return data

    } catch (err) {
      console.error('❌ Failed to fetch configurations:', err)
      configError.value = err
      
      // Don't clear cache on error, use stale data if available
      if (configurationCache.value) {
        console.log('⚠️ Using stale configuration data due to error')
        return configurationCache.value
      }
      
      throw err
    } finally {
      isConfigLoading.value = false
    }
  }

  // Get specific configuration section
  const getLanguageConfig = async () => {
    const data = await fetchConfigurations()
    return data?.language || {}
  }

  const getMaintenanceConfig = async () => {
    const data = await fetchConfigurations()
    return data || {}
  }

  const getBannerConfig = async () => {
    const data = await fetchConfigurations()
    return data?.banners || {}
  }

  // Clear cache manually
  const clearCache = () => {
    configurationCache.value = null
    lastFetchTime.value = 0
    configError.value = null
  }

  return {
    // Main functions
    fetchConfigurations,
    getLanguageConfig,
    getMaintenanceConfig, 
    getBannerConfig,
    clearCache,
    
    // State
    configurationCache: readonly(configurationCache),
    isConfigLoading: readonly(isConfigLoading),
    configError: readonly(configError),
    isCacheValid,
    
    // Utils
    lastFetchTime: readonly(lastFetchTime)
  }
}