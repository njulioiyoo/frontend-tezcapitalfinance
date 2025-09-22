export interface GeneralConfig {
  app_name: string
  app_description: string
}

export interface SocialMediaItem {
  platform: string
  url: string
  icon?: string
}

export interface ContactConfig {
  social_media: SocialMediaItem[]
  contact_phone: string
  contact_email: string
  contact_address: string
  contact_whatsapp: string
}

export interface ConfigurationData {
  general: GeneralConfig
  contact: ContactConfig
}

export const useConfiguration = () => {
  const apiStore = useApiStore()
  const configData = ref<ConfigurationData | null>(null)
  const isLoading = ref(false)
  const error = ref<any>(null)

  // Computed values for easy access - no fallbacks
  const appName = computed(() => {
    return configData.value?.general?.app_name || ''
  })

  const appDescription = computed(() => {
    return configData.value?.general?.app_description || ''
  })

  const socialMedia = computed(() => {
    return configData.value?.contact?.social_media || []
  })

  const contactPhone = computed(() => {
    return configData.value?.contact?.contact_phone || ''
  })

  const contactEmail = computed(() => {
    return configData.value?.contact?.contact_email || ''
  })

  const contactAddress = computed(() => {
    return configData.value?.contact?.contact_address || ''
  })

  const contactWhatsapp = computed(() => {
    return configData.value?.contact?.contact_whatsapp || ''
  })

  // Fetch configuration data using cache
  const fetchConfiguration = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const { fetchConfigurations } = useConfigurationCache()
      const data = await fetchConfigurations()
      console.log('🔧 Configuration cached data:', data)

      console.log('🔧 Configuration processed data:', data)

      // Extract configuration data - no fallbacks
      if (data) {
        const generalConfig: GeneralConfig = {
          app_name: data.general?.app_name?.value || data.general?.app_name || '',
          app_description: data.general?.app_description?.value || data.general?.app_description || ''
        }

        // Parse social media data
        let socialMediaData: SocialMediaItem[] = []
        console.log('🔧 Looking for social media in contact:', data.contact)
        
        if (data.contact?.social_media) {
          console.log('🔧 Raw social media data:', data.contact.social_media)
          
          try {
            // Get the actual value from social_media.value
            let socialMediaRaw = data.contact.social_media.value || data.contact.social_media
            console.log('🔧 Social media value:', socialMediaRaw)
            
            if (typeof socialMediaRaw === 'string') {
              console.log('🔧 Parsing social media JSON string:', socialMediaRaw)
              socialMediaData = JSON.parse(socialMediaRaw)
            } else if (Array.isArray(socialMediaRaw)) {
              console.log('🔧 Social media is already array:', socialMediaRaw)
              socialMediaData = socialMediaRaw
            } else if (typeof socialMediaRaw === 'object' && socialMediaRaw !== null) {
              console.log('🔧 Converting social media object to array:', socialMediaRaw)
              // Convert object format to array format
              socialMediaData = Object.entries(socialMediaRaw)
                .filter(([platform, url]) => url && url.trim() !== '') // Only include non-empty URLs
                .map(([platform, url]) => ({
                  platform: platform,
                  url: url as string,
                  icon: undefined // Will be mapped later
                }))
              console.log('🔧 Converted social media array:', socialMediaData)
            } else {
              console.log('🔧 Unknown social media format:', typeof socialMediaRaw, socialMediaRaw)
            }
            
            console.log('🔧 Final social media data:', socialMediaData)
          } catch (e) {
            console.warn('Failed to parse social media data:', e)
            socialMediaData = []
          }
        } else {
          console.log('🔧 No social media data found in contact')
        }

        const contactConfig: ContactConfig = {
          social_media: socialMediaData,
          contact_phone: data.contact?.contact_phone?.value || data.contact?.contact_phone || '',
          contact_email: data.contact?.contact_email?.value || data.contact?.contact_email || '',
          contact_address: data.contact?.contact_address?.value || data.contact?.contact_address || '',
          contact_whatsapp: data.contact?.contact_whatsapp?.value || data.contact?.contact_whatsapp || ''
        }

        configData.value = {
          general: generalConfig,
          contact: contactConfig
        }

        console.log('🔧 Final configuration:', configData.value)
      } else {
        // No configuration data found
        configData.value = {
          general: {
            app_name: '',
            app_description: ''
          },
          contact: {
            social_media: [],
            contact_phone: '',
            contact_email: '',
            contact_address: '',
            contact_whatsapp: ''
          }
        }
      }
    } catch (err) {
      error.value = err
      console.error('Failed to fetch configuration:', err)
      
      // No fallback on error
      configData.value = {
        general: {
          app_name: '',
          app_description: ''
        },
        contact: {
          social_media: [],
          contact_phone: '',
          contact_email: '',
          contact_address: '',
          contact_whatsapp: ''
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize configuration
  const initConfiguration = async () => {
    await fetchConfiguration()
  }

  return {
    configData: readonly(configData),
    appName,
    appDescription,
    socialMedia,
    contactPhone,
    contactEmail,
    contactAddress,
    contactWhatsapp,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchConfiguration,
    initConfiguration
  }
}