export interface GeneralConfig {
  app_name: string
  app_description: string
  apply_now_link: string
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

export interface OjkConfig {
  ojk_title: string
  ojk_description: string
  ojk_images: any[]
}

export interface WorkplaceConfig {
  workplace_working_environment_title_id: string
  workplace_working_environment_title_en: string
  workplace_working_environment_description_id: string
  workplace_working_environment_description_en: string
  workplace_working_environment_image: string
  workplace_working_environment_slug: string
  workplace_employee_benefits_title_id: string
  workplace_employee_benefits_title_en: string
  workplace_employee_benefits_description_id: string
  workplace_employee_benefits_description_en: string
  workplace_employee_benefits_image: string
  workplace_employee_benefits_slug: string
}

export interface JoinUsConfig {
  career_application_email: string
  button_join_us_enabled: boolean
  workplace: WorkplaceConfig
}

export interface ConfigurationData {
  general: GeneralConfig
  contact: ContactConfig
  ojk?: OjkConfig
  join_us?: JoinUsConfig
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

  const applyNowLink = computed(() => {
    return configData.value?.general?.apply_now_link || ''
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

  // OJK Configuration
  const ojkTitle = computed(() => {
    return configData.value?.ojk?.ojk_title?.value || configData.value?.ojk?.ojk_title || 'Berizin dan Diawasi oleh Otoritas Jasa Keuangan'
  })

  const ojkDescription = computed(() => {
    return configData.value?.ojk?.ojk_description?.value || configData.value?.ojk?.ojk_description || '© 2025 PT TEZ Capital and Finance. All Rights Reserved'
  })

  const ojkImages = computed(() => {
    const ojkImagesData = configData.value?.ojk?.ojk_images?.value || configData.value?.ojk?.ojk_images
    
    if (!ojkImagesData) {
      return []
    }

    try {
      if (typeof ojkImagesData === 'string') {
        const parsed = JSON.parse(ojkImagesData)
        return Array.isArray(parsed) ? parsed : []
      } else if (Array.isArray(ojkImagesData)) {
        return ojkImagesData
      }
    } catch (e) {
    }
    
    return []
  })

  // Join Us Configuration
  const careerApplicationEmail = computed(() => {
    return configData.value?.join_us?.career_application_email || ''
  })

  const buttonJoinUsEnabled = computed(() => {
    return configData.value?.join_us?.button_join_us_enabled ?? true
  })

  // Fetch configuration data directly from API (real-time)
  const fetchConfiguration = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl || 'http://cms.tez-capital.web.local'
      const url = `${baseURL}/api/v1/configurations?_t=${Date.now()}`
      
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


      // Extract configuration data - no fallbacks
      if (data) {
        const generalConfig: GeneralConfig = {
          app_name: data.general?.app_name?.value || data.general?.app_name || '',
          app_description: data.general?.app_description?.value || data.general?.app_description || '',
          apply_now_link: data.general?.apply_now_link?.value || data.general?.apply_now_link || ''
        }

        // Parse social media data
        let socialMediaData: SocialMediaItem[] = []
        
        if (data.contact?.social_media) {
          
          try {
            // Get the actual value from social_media.value
            let socialMediaRaw = data.contact.social_media.value || data.contact.social_media
            
            if (typeof socialMediaRaw === 'string') {
              socialMediaData = JSON.parse(socialMediaRaw)
            } else if (Array.isArray(socialMediaRaw)) {
              socialMediaData = socialMediaRaw
            } else if (typeof socialMediaRaw === 'object' && socialMediaRaw !== null) {
              // Convert object format to array format
              socialMediaData = Object.entries(socialMediaRaw)
                .filter(([platform, url]) => url && url.trim() !== '') // Only include non-empty URLs
                .map(([platform, url]) => ({
                  platform: platform,
                  url: url as string,
                  icon: undefined // Will be mapped later
                }))
            } else {
            }
            
          } catch (e) {
            socialMediaData = []
          }
        } else {
        }

        const contactConfig: ContactConfig = {
          social_media: socialMediaData,
          contact_phone: data.contact?.contact_phone?.value || data.contact?.contact_phone || '',
          contact_email: data.contact?.contact_email?.value || data.contact?.contact_email || '',
          contact_address: data.contact?.contact_address?.value || data.contact?.contact_address || '',
          contact_whatsapp: data.contact?.contact_whatsapp?.value || data.contact?.contact_whatsapp || ''
        }

        // Parse OJK configuration data
        const ojkConfig = {
          ojk_title: data.ojk?.ojk_title?.value || data.ojk?.ojk_title || '',
          ojk_description: data.ojk?.ojk_description?.value || data.ojk?.ojk_description || '',
          ojk_images: data.ojk?.ojk_images?.value || data.ojk?.ojk_images || []
        }
        
        // Parse Join Us configuration data
        const workplaceConfig: WorkplaceConfig = {
          workplace_working_environment_title_id: '',
          workplace_working_environment_title_en: '',
          workplace_working_environment_description_id: '',
          workplace_working_environment_description_en: '',
          workplace_working_environment_image: '',
          workplace_working_environment_slug: '',
          workplace_employee_benefits_title_id: '',
          workplace_employee_benefits_title_en: '',
          workplace_employee_benefits_description_id: '',
          workplace_employee_benefits_description_en: '',
          workplace_employee_benefits_image: '',
          workplace_employee_benefits_slug: ''
        };

        // Extract workplace configurations from join_us data
        const workplaceKeys = Object.keys(workplaceConfig) as (keyof WorkplaceConfig)[];
        workplaceKeys.forEach(key => {
          if (data.join_us?.[key]) {
            const value = data.join_us[key].value || data.join_us[key];
            (workplaceConfig as any)[key] = value;
          }
        });

        const joinUsConfig: JoinUsConfig = {
          career_application_email: '',
          button_join_us_enabled: true,
          workplace: workplaceConfig
        };
        
        if (data.join_us?.career_application_email) {
          if (typeof data.join_us.career_application_email === 'string') {
            joinUsConfig.career_application_email = data.join_us.career_application_email;
          } else if (data.join_us.career_application_email.value) {
            joinUsConfig.career_application_email = data.join_us.career_application_email.value;
          }
        }
        if (data.join_us?.button_join_us_enabled !== undefined) {
          if (typeof data.join_us.button_join_us_enabled === 'boolean') {
            joinUsConfig.button_join_us_enabled = data.join_us.button_join_us_enabled;
          } else if (data.join_us.button_join_us_enabled?.value !== undefined) {
            joinUsConfig.button_join_us_enabled = Boolean(data.join_us.button_join_us_enabled.value);
          }
        }
        
        configData.value = {
          general: generalConfig,
          contact: contactConfig,
          ojk: ojkConfig,
          join_us: joinUsConfig
        }

      } else {
        // No configuration data found
        configData.value = {
          general: {
            app_name: '',
            app_description: '',
            apply_now_link: ''
          },
          contact: {
            social_media: [],
            contact_phone: '',
            contact_email: '',
            contact_address: '',
            contact_whatsapp: ''
          },
          ojk: {
            ojk_title: '',
            ojk_description: '',
            ojk_images: []
          },
          join_us: {
            career_application_email: '',
            button_join_us_enabled: true,
            workplace: {
              workplace_working_environment_title_id: '',
              workplace_working_environment_title_en: '',
              workplace_working_environment_description_id: '',
              workplace_working_environment_description_en: '',
              workplace_working_environment_image: '',
              workplace_working_environment_slug: '',
              workplace_employee_benefits_title_id: '',
              workplace_employee_benefits_title_en: '',
              workplace_employee_benefits_description_id: '',
              workplace_employee_benefits_description_en: '',
              workplace_employee_benefits_image: '',
              workplace_employee_benefits_slug: ''
            }
          }
        }
      }
    } catch (err) {
      error.value = err
      
      // No fallback on error
      configData.value = {
        general: {
          app_name: '',
          app_description: '',
          apply_now_link: ''
        },
        contact: {
          social_media: [],
          contact_phone: '',
          contact_email: '',
          contact_address: '',
          contact_whatsapp: ''
        },
        ojk: {
          ojk_title: '',
          ojk_description: '',
          ojk_images: []
        },
        join_us: {
          career_application_email: '',
          button_join_us_enabled: true,
          workplace: {
            workplace_working_environment_title_id: '',
            workplace_working_environment_title_en: '',
            workplace_working_environment_description_id: '',
            workplace_working_environment_description_en: '',
            workplace_working_environment_image: '',
            workplace_working_environment_slug: '',
            workplace_employee_benefits_title_id: '',
            workplace_employee_benefits_title_en: '',
            workplace_employee_benefits_description_id: '',
            workplace_employee_benefits_description_en: '',
            workplace_employee_benefits_image: '',
            workplace_employee_benefits_slug: ''
          }
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
    applyNowLink,
    socialMedia,
    contactPhone,
    contactEmail,
    contactAddress,
    contactWhatsapp,
    ojkTitle,
    ojkDescription,
    ojkImages,
    careerApplicationEmail,
    buttonJoinUsEnabled,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchConfiguration,
    initConfiguration
  }
}