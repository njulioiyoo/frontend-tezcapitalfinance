export const useJoinUs = () => {
  const apiStore = useApiStore()
  const { locale } = useI18n()

  const joinUsData = ref({
    heroTitle: '',
    bannerTitle: '',
    bannerDescription: '',
    bannerImage: '',
    ceoMessage: {
      title: '',
      content: '',
      image: ''
    },
    isLoading: true,
    error: null
  })

  const loadJoinUsData = async () => {
    try {
      joinUsData.value.isLoading = true
      joinUsData.value.error = null

      const response = await apiStore.apiCall('api/v1/configurations')
      
      if (response && response.success) {
        const configs = response.data
        
        // Set join us data from configurations based on current locale
        const currentLocale = locale.value
        joinUsData.value.heroTitle = currentLocale === 'en' 
          ? (configs.join_us?.hero_title_en?.value || '')
          : (configs.join_us?.hero_title_id?.value || '')
        
        // Banner data from banners group
        joinUsData.value.bannerTitle = currentLocale === 'en'
          ? (configs.banners?.banner_join_us_title_en?.value || '')
          : (configs.banners?.banner_join_us_title_id?.value || '')
        
        joinUsData.value.bannerDescription = currentLocale === 'en'
          ? (configs.banners?.banner_join_us_description_en?.value || '')
          : (configs.banners?.banner_join_us_description_id?.value || '')
        
        joinUsData.value.bannerImage = configs.banners?.banner_join_us_image?.value || ''
        
        // Process CEO image URL
        let ceoImageUrl = configs.join_us?.ceo_image?.value || ''
        if (ceoImageUrl && !ceoImageUrl.startsWith('http') && !ceoImageUrl.startsWith('/')) {
          // If it's a relative path from storage, convert to full URL
          const config = useRuntimeConfig()
          const baseURL = config.public.apiBaseUrl || 'http://cms.tez-capital.web.local'
          ceoImageUrl = `${baseURL}/storage/${ceoImageUrl}`
        }

        joinUsData.value.ceoMessage = {
          title: currentLocale === 'en'
            ? (configs.join_us?.ceo_message_title_en?.value || '')
            : (configs.join_us?.ceo_message_title_id?.value || ''),
          content: currentLocale === 'en'
            ? (configs.join_us?.ceo_message_content_en?.value || '')
            : (configs.join_us?.ceo_message_content_id?.value || ''),
          image: ceoImageUrl
        }
      }
    } catch (error) {
      joinUsData.value.error = error
      
      // Set empty values when API fails - no hardcode
      joinUsData.value.heroTitle = ''
      joinUsData.value.bannerTitle = ''
      joinUsData.value.bannerDescription = ''
      joinUsData.value.bannerImage = ''
      joinUsData.value.ceoMessage = {
        title: '',
        content: '',
        image: ''
      }
    } finally {
      joinUsData.value.isLoading = false
    }
  }

  return {
    joinUsData: readonly(joinUsData),
    loadJoinUsData
  }
}