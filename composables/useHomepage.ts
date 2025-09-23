export interface ServiceItem {
  id: number
  title: string
  excerpt: string
  content: string
  featured_image: string
  category: string
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  url: string
}

export interface ServicesData {
  title: string
  subtitle: string
  items: ServiceItem[]
}

export interface FAQItem {
  id: number
  question: string
  answer: string
  order: number
}

export interface FAQData {
  enabled: boolean
  title: string
  subtitle: string | null
  items: FAQItem[]
}

export interface SixReasonItem {
  id: number
  title: string
  description: string
  icon: string
  order: number
}

export interface SixReasonsData {
  title: string
  subtitle: string
  items: SixReasonItem[]
}

export interface ApplicationProcessItem {
  step: number
  title: string
  description: string
  icon: string
  order: number
}

export interface ApplicationProcessData {
  title: string
  subtitle: string
  steps: ApplicationProcessItem[]
}

export interface PartnerItem {
  id: number
  name: string
  logo: string
  url: string
  order: number
}

export interface PartnersData {
  title: string
  subtitle: string
  items: PartnerItem[]
}

export interface NewsItem {
  id: number
  title: string
  excerpt: string
  content: string
  featured_image: string
  category: string
  published_at: string
  created_at: string
  updated_at: string
  url: string
}

export interface NewsData {
  title: string
  subtitle: string
  items: NewsItem[]
}

export interface HomepageData {
  six_reasons: SixReasonsData
  application_process: ApplicationProcessData
  services: ServicesData
  partners: PartnersData
  news: NewsData
  faq: FAQData
}

export const useHomepage = () => {
  const apiStore = useApiStore()
  const { locale } = useI18n()
  const homepageData = ref<HomepageData | null>(null)
  const isLoading = ref(true)
  const error = ref<any>(null)

  // Computed values for easy access
  const sixReasons = computed(() => {
    return homepageData.value?.six_reasons?.items || []
  })

  const sixReasonsTitle = computed(() => {
    return homepageData.value?.six_reasons?.title || ''
  })

  const applicationProcess = computed(() => {
    return homepageData.value?.application_process?.steps || []
  })

  const applicationProcessTitle = computed(() => {
    return homepageData.value?.application_process?.title || ''
  })

  const services = computed(() => {
    return homepageData.value?.services?.items || []
  })

  const servicesTitle = computed(() => {
    return homepageData.value?.services?.title || ''
  })

  const partners = computed(() => {
    return homepageData.value?.partners?.items || []
  })

  const partnersTitle = computed(() => {
    return homepageData.value?.partners?.title || ''
  })

  const news = computed(() => {
    return homepageData.value?.news?.items || []
  })

  const newsTitle = computed(() => {
    return homepageData.value?.news?.title || ''
  })

  const faqItems = computed(() => {
    return homepageData.value?.faq?.items || []
  })

  const faqTitle = computed(() => {
    return homepageData.value?.faq?.title || ''
  })

  // Fetch homepage data
  const fetchHomepage = async () => {
    try {
      isLoading.value = true
      error.value = null
      homepageData.value = null
      
      // Minimum loading time untuk skeleton
      const [response] = await Promise.all([
        apiStore.fetchHomepage(),
        new Promise(resolve => setTimeout(resolve, 500))
      ])
      
      // Handle different response structures
      let data = response
      if (response && typeof response === 'object') {
        if (response.data) {
          data = response.data
        } else if (response.success && response.data) {
          data = response.data
        }
      }


      // Extract homepage data
      if (data) {
        const sixReasonsData: SixReasonsData = {
          title: data.six_reasons?.title || '',
          subtitle: data.six_reasons?.subtitle || '',
          items: data.six_reasons?.items || []
        }

        const applicationProcessData: ApplicationProcessData = {
          title: data.application_process?.title || '',
          subtitle: data.application_process?.subtitle || '',
          steps: data.application_process?.steps || []
        }
        

        const servicesData: ServicesData = {
          title: data.services?.title || '',
          subtitle: data.services?.subtitle || '',
          items: data.services?.items || []
        }

        const partnersData: PartnersData = {
          title: data.partners?.title || '',
          subtitle: data.partners?.subtitle || '',
          items: data.partners?.items || []
        }

        const newsData: NewsData = {
          title: data.news?.title || '',
          subtitle: data.news?.subtitle || '',
          items: data.news?.items || []
        }

        const faqData: FAQData = {
          enabled: data.faq?.enabled || false,
          title: data.faq?.title || '',
          subtitle: data.faq?.subtitle || null,
          items: data.faq?.items || []
        }

        homepageData.value = {
          six_reasons: sixReasonsData,
          application_process: applicationProcessData,
          services: servicesData,
          partners: partnersData,
          news: newsData,
          faq: faqData
        }

      } else {
        // No homepage data found
        homepageData.value = {
          six_reasons: {
            title: '',
            subtitle: '',
            items: []
          },
          application_process: {
            title: '',
            subtitle: '',
            steps: []
          },
          services: {
            title: '',
            subtitle: '',
            items: []
          },
          partners: {
            title: '',
            subtitle: '',
            items: []
          },
          news: {
            title: '',
            subtitle: '',
            items: []
          },
          faq: {
            enabled: false,
            title: '',
            subtitle: null,
            items: []
          }
        }
      }
    } catch (err) {
      error.value = err
      
      // No fallback on error
      homepageData.value = {
        six_reasons: {
          title: '',
          subtitle: '',
          items: []
        },
        application_process: {
          title: '',
          subtitle: '',
          steps: []
        },
        services: {
          title: '',
          subtitle: '',
          items: []
        },
        partners: {
          title: '',
          subtitle: '',
          items: []
        },
        news: {
          title: '',
          subtitle: '',
          items: []
        },
        faq: {
          enabled: false,
          title: '',
          subtitle: null,
          items: []
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize homepage data
  const initHomepage = async () => {
    await fetchHomepage()
  }

  // Watch for language changes and refetch data
  watch(() => locale.value, () => {
    fetchHomepage()
  }, { immediate: false })

  return {
    homepageData: readonly(homepageData),
    sixReasons,
    sixReasonsTitle,
    applicationProcess,
    applicationProcessTitle,
    services,
    servicesTitle,
    partners,
    partnersTitle,
    news,
    newsTitle,
    faqItems,
    faqTitle,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchHomepage,
    initHomepage
  }
}