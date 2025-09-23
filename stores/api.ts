import type { 
  AboutData, 
  HomepageData, 
  NewsResponse, 
  NewsItem, 
  ServicesResponse,
  ServiceDetailResponse,
  ServicesData, 
  ServiceItem, 
  ContactData, 
  CorporateData 
} from '~/types/api'

export const useApiStore = defineStore('api', () => {
  const config = useRuntimeConfig()
  const { locale } = useI18n()
  
  // Base URL from ENV only
  const baseURL = config.public.apiBaseUrl
  
  // Ensure API base URL is configured
  if (!baseURL) {
    throw new Error('NUXT_PUBLIC_API_BASE_URL environment variable is required but not defined')
  }
  
  // Base API call function
  const apiCall = async <T>(endpoint: string, options: any = {}, includeLang: boolean = false): Promise<T> => {
    const url = `${baseURL}/${endpoint.replace(/^\//, '')}`
    
    // Add cache busting to all requests
    const separator = url.includes('?') ? '&' : '?'
    const timestamp = Date.now()
    let finalUrl = `${url}${separator}_t=${timestamp}`
    
    // Add language parameter only when specifically requested
    if (includeLang) {
      finalUrl += `&lang=${locale.value}`
    }
    
    try {
      const data = await $fetch<T>(finalUrl, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options.headers
        },
        // Disable Nuxt's internal caching
        server: false,
        default: () => null
      })
      
      console.log(`API Response for ${endpoint}:`, data)
      return data
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      throw error
    }
  }

  // About API
  const fetchAbout = async (): Promise<AboutData> => {
    const response = await apiCall<any>('api/v1/about', {}, true)
    
    let data = response
    // Handle different response structures
    if (response && typeof response === 'object') {
      // If response has a data property, use it
      if (response.data) {
        data = response.data
      }
      // If response has success property and data, use data
      else if (response.success && response.data) {
        data = response.data
      }
    }
    
    // Process mission data if it's a JSON string
    if (data && data.mission && typeof data.mission === 'string') {
      try {
        // First try to parse as JSON array
        const parsed = JSON.parse(data.mission)
        
        if (Array.isArray(parsed)) {
          // Keep the original objects, don't extract text here
          const missionItems = parsed.sort((a, b) => (a.order || 0) - (b.order || 0))
          
          data.mission = {
            title: "Misi Kami",
            items: missionItems
          }
        }
      } catch (error) {
        // If JSON parsing fails, try regex extraction
        try {
          const missionText = data.mission
          const missionItems = []
          
          // More flexible regex to handle different spacing
          const regex = /\{\s*"id"\s*:\s*\d+\s*,\s*"text"\s*:\s*"([^"]+)"\s*,\s*"order"\s*:\s*\d+\s*\}/g
          let match
          while ((match = regex.exec(missionText)) !== null) {
            missionItems.push({ text: match[1] })
          }
          
          if (missionItems.length > 0) {
            data.mission = {
              title: "Misi Kami",
              items: missionItems
            }
          }
        } catch (regexError) {
        }
      }
    }
    
    // Process logo_philosophy data if points is a JSON string
    if (data && data.logo_philosophy && typeof data.logo_philosophy.points === 'string') {
      try {
        const parsed = JSON.parse(data.logo_philosophy.points)
        
        if (Array.isArray(parsed)) {
          // Keep the original objects, don't extract text here
          const points = parsed.sort((a, b) => (a.order || 0) - (b.order || 0))
          
          data.logo_philosophy.points = points
        }
      } catch (error) {
        // Try regex extraction
        try {
          const pointsText = data.logo_philosophy.points
          const pointsItems = []
          
          const regex = /\{\s*"id"\s*:\s*\d+\s*,\s*"text"\s*:\s*"([^"]+)"\s*,\s*"order"\s*:\s*\d+\s*\}/g
          let match
          while ((match = regex.exec(pointsText)) !== null) {
            pointsItems.push({ text: match[1] })
          }
          
          if (pointsItems.length > 0) {
            data.logo_philosophy.points = pointsItems
          }
        } catch (regexError) {
        }
      }
    }
    
    return data || {}
  }

  // Homepage API
  const fetchHomepage = async (): Promise<HomepageData> => {
    return await apiCall<HomepageData>('api/v1/homepage', {}, true)
  }

  // News API (supports filtering)
  const fetchNews = async (params: {
    page?: number
    limit?: number
    type?: 'news' | 'event' | 'all'
    category?: string
    search?: string
    featured?: boolean
    upcoming?: boolean
    date?: string
    date_from?: string
    date_to?: string
  } = {}): Promise<NewsResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.set('page', params.page.toString())
    if (params.limit) queryParams.set('limit', params.limit.toString())
    if (params.type) queryParams.set('type', params.type)
    if (params.category) queryParams.set('category', params.category)
    if (params.search) queryParams.set('search', params.search)
    if (params.featured) queryParams.set('featured', '1')
    if (params.upcoming) queryParams.set('upcoming', '1')
    if (params.date) queryParams.set('date', params.date)
    if (params.date_from) queryParams.set('date_from', params.date_from)
    if (params.date_to) queryParams.set('date_to', params.date_to)
    
    const query = queryParams.toString()
    const endpoint = query ? `api/v1/news?${query}` : 'api/v1/news'
    
    return await apiCall<NewsResponse>(endpoint)
  }

  // News Detail API (by slug)
  const fetchNewsDetail = async (slug: string): Promise<NewsItem> => {
    return await apiCall<NewsItem>(`api/v1/news/${slug}`, {}, true)
  }

  // Services API
  const fetchServices = async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    featured?: boolean
  } = {}): Promise<ServicesResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.set('page', params.page.toString())
    if (params.limit) queryParams.set('limit', params.limit.toString())
    if (params.category) queryParams.set('category', params.category)
    if (params.search) queryParams.set('search', params.search)
    if (params.featured) queryParams.set('featured', '1')
    
    const query = queryParams.toString()
    const endpoint = query ? `api/v1/services?${query}` : 'api/v1/services'
    
    return await apiCall<ServicesResponse>(endpoint)
  }

  // Service Detail API (by slug)
  const fetchServiceDetail = async (slug: string): Promise<ServiceDetailResponse> => {
    return await apiCall<ServiceDetailResponse>(`api/v1/services/slug/${slug}`, {}, true)
  }

  // Contact API
  const fetchContact = async (): Promise<ContactData> => {
    return await apiCall<ContactData>('api/v1/contact')
  }

  // Corporate API
  const fetchCorporate = async (): Promise<CorporateData> => {
    return await apiCall<CorporateData>('api/v1/corporate')
  }

  // Maintenance Configuration API
  const fetchMaintenanceConfig = async (): Promise<any> => {
    return await apiCall<any>('api/v1/configurations')
  }

  return {
    baseURL,
    apiCall,
    fetchAbout,
    fetchHomepage,
    fetchNews,
    fetchNewsDetail,
    fetchServices,
    fetchServiceDetail,
    fetchContact,
    fetchCorporate,
    fetchMaintenanceConfig
  }
})