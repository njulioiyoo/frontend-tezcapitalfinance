export const useJoinUs = () => {
  const { $api } = useNuxtApp()
  const { locale } = useI18n()

  const joinUsData = ref({
    heroTitle: '',
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

      const response = await $api.get('/api/configurations/public')
      
      if (response.data) {
        const configs = response.data
        
        // Set join us data from configurations based on current locale
        const currentLocale = locale.value
        joinUsData.value.heroTitle = currentLocale === 'en' 
          ? (configs.hero_title_en || 'Be Part of TEZ Capital')
          : (configs.hero_title_id || 'Bagian dari TEZ Capital')
        
        joinUsData.value.ceoMessage = {
          title: currentLocale === 'en'
            ? (configs.ceo_message_title_en || 'Message from CEO')
            : (configs.ceo_message_title_id || 'Pesan dari CEO'),
          content: currentLocale === 'en'
            ? (configs.ceo_message_content_en || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. We are committed to providing innovative financial solutions that empower businesses to grow and succeed. Our experienced team understands the unique challenges facing modern enterprises and we are here to support your journey towards financial success.

Through our comprehensive range of services, we aim to be your trusted partner in achieving your business goals. Together, we can build a stronger financial future for your organization.`)
            : (configs.ceo_message_content_id || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a gravida metus. Pellentesque interdum tristique lacus, vitae ultrices sapien ultrices hendrerit. Quisque diam lorem, vestibulum nec risus sit amet, mollis dapibus nunc. Nunc pharetra eget odio quis facilisis. Maecenas blandit, magna vel commodo blandit, nibh purus hendrerit quam, nec interdum leo arcu ac ipsum.

Fusce ullamcorper ornare odio, id rutrum diam dignissim semper. Fusce nec massa at nunc vulputate feugiat et vitae lectus. Sed interdum hendrerit mi, sit amet tincidunt quam ultrices quis.`),
          image: configs.ceo_image || '/img/profile/1.png'
        }
      }
    } catch (error) {
      joinUsData.value.error = error
      
      // Fallback to default values based on locale
      const currentLocale = locale.value
      joinUsData.value.heroTitle = currentLocale === 'en' 
        ? 'Be Part of TEZ Capital'
        : 'Bagian dari TEZ Capital'
      
      joinUsData.value.ceoMessage = {
        title: currentLocale === 'en' ? 'Message from CEO' : 'Pesan dari CEO',
        content: currentLocale === 'en'
          ? `Lorem ipsum dolor sit amet, consectetur adipiscing elit. We are committed to providing innovative financial solutions that empower businesses to grow and succeed. Our experienced team understands the unique challenges facing modern enterprises and we are here to support your journey towards financial success.

Through our comprehensive range of services, we aim to be your trusted partner in achieving your business goals. Together, we can build a stronger financial future for your organization.`
          : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a gravida metus. Pellentesque interdum tristique lacus, vitae ultrices sapien ultrices hendrerit. Quisque diam lorem, vestibulum nec risus sit amet, mollis dapibus nunc. Nunc pharetra eget odio quis facilisis. Maecenas blandit, magna vel commodo blandit, nibh purus hendrerit quam, nec interdum leo arcu ac ipsum.

Fusce ullamcorper ornare odio, id rutrum diam dignissim semper. Fusce nec massa at nunc vulputate feugiat et vitae lectus. Sed interdum hendrerit mi, sit amet tincidunt quam ultrices quis.`,
        image: '/img/profile/1.png'
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