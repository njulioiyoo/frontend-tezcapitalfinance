export interface MaintenanceConfig {
  enabled: boolean
  title: string
  message: string
  estimated_time: string
  contact_email: string
}

export const useMaintenance = () => {
  const apiStore = useApiStore()
  const maintenanceConfig = ref<MaintenanceConfig | null>(null)
  const isLoading = ref(false)
  const error = ref<any>(null)

  // Check if maintenance mode is enabled
  const isMaintenanceMode = computed(() => {
    return maintenanceConfig.value?.enabled === true
  })

  // Fetch maintenance configuration
  const fetchMaintenanceConfig = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiStore.fetchMaintenanceConfig()
      console.log('🔧 Raw API response:', response)
      
      // Handle different response structures
      let data = response
      if (response && typeof response === 'object') {
        if (response.data) {
          data = response.data
        } else if (response.success && response.data) {
          data = response.data
        }
      }
      
      console.log('🔧 Processed data:', data)

      // Extract maintenance configuration based on actual API structure
      console.log('🔧 Looking for maintenance config in:', data)
      
      if (data && data.maintenance && data.maintenance.maintenance_mode_enabled) {
        const maintenanceData = data.maintenance
        console.log('🔧 Found maintenance section:', maintenanceData)
        
        maintenanceConfig.value = {
          enabled: maintenanceData.maintenance_mode_enabled?.value === true,
          title: maintenanceData.maintenance_title?.value || maintenanceData.maintenance_title || '',
          message: maintenanceData.maintenance_message?.value || maintenanceData.maintenance_message || '',
          estimated_time: maintenanceData.maintenance_estimated_time?.value || maintenanceData.maintenance_estimated_time || '',
          contact_email: maintenanceData.maintenance_contact_email?.value || maintenanceData.maintenance_contact_email || ''
        }
        
        console.log('🔧 Final maintenance config:', maintenanceConfig.value)
      } else {
        console.log('🔧 No maintenance config found, setting to disabled')
        // Default to maintenance disabled if no config found
        maintenanceConfig.value = {
          enabled: false,
          title: '',
          message: '',
          estimated_time: '',
          contact_email: ''
        }
      }
    } catch (err) {
      error.value = err
      console.error('Failed to fetch maintenance config:', err)
      
      // Default to maintenance disabled on error - no fallback values
      maintenanceConfig.value = {
        enabled: false,
        title: '',
        message: '',
        estimated_time: '',
        contact_email: ''
      }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize maintenance check
  const initMaintenance = async () => {
    await fetchMaintenanceConfig()
  }

  return {
    maintenanceConfig: readonly(maintenanceConfig),
    isMaintenanceMode,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchMaintenanceConfig,
    initMaintenance
  }
}