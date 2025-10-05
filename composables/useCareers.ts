export interface Career {
  id: number
  slug: string
  title_id: string
  title_en: string
  excerpt_id?: string
  excerpt_en?: string
  content_id: string
  content_en: string
  requirements_id?: string
  requirements_en?: string
  benefits_id?: string
  benefits_en?: string
  location_id: string
  location_en: string
  department_id?: string
  department_en?: string
  tags: string[]
  start_date: string
  end_date: string
  published_at: string
  view_count?: number
  created_at: string
  updated_at?: string
}

export interface CareerApiResponse {
  success: boolean
  message: string
  data: {
    data: Career[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
    links: any[]
    path: string
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    prev_page_url: string | null
  }
  departments: string[]
  response_time_ms: number
}

export interface CareerDetailResponse {
  success: boolean
  message: string
  data: Career
  departments: string[]
  response_time_ms: number
}

export interface CareerFeaturedResponse {
  success: boolean
  message: string
  data: Career[]
  response_time_ms: number
}

export interface CareerStatsResponse {
  success: boolean
  message: string
  data: {
    total_careers: number
    total_departments: number
    total_locations: number
    departments: Record<string, number>
    locations: Record<string, number>
  }
  response_time_ms: number
}

export const useCareers = () => {
  const config = useRuntimeConfig()
  
  const getCareers = async (params: {
    search?: string
    location?: string
    department?: string
    page?: number
    limit?: number
  } = {}): Promise<CareerApiResponse> => {
    const query = new URLSearchParams()
    
    if (params.search) query.append('search', params.search)
    if (params.location) query.append('location', params.location)
    if (params.department) query.append('department', params.department)
    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())
    
    const response = await $fetch<CareerApiResponse>(`${config.public.apiBaseUrl}/api/v1/careers?${query.toString()}`)
    return response
  }

  const getCareerBySlug = async (slug: string): Promise<CareerDetailResponse> => {
    const response = await $fetch<CareerDetailResponse>(`${config.public.apiBaseUrl}/api/v1/careers/${slug}`)
    return response
  }

  const getFeaturedCareers = async (limit: number = 6): Promise<CareerFeaturedResponse> => {
    const response = await $fetch<CareerFeaturedResponse>(`${config.public.apiBaseUrl}/api/v1/careers/featured?limit=${limit}`)
    return response
  }

  const searchCareers = async (params: {
    q?: string
    locations?: string[]
    departments?: string[]
    posted_after?: string
    deadline_before?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    page?: number
    limit?: number
  } = {}): Promise<CareerApiResponse> => {
    const query = new URLSearchParams()
    
    if (params.q) query.append('q', params.q)
    if (params.locations) params.locations.forEach(loc => query.append('locations[]', loc))
    if (params.departments) params.departments.forEach(dept => query.append('departments[]', dept))
    if (params.posted_after) query.append('posted_after', params.posted_after)
    if (params.deadline_before) query.append('deadline_before', params.deadline_before)
    if (params.sort_by) query.append('sort_by', params.sort_by)
    if (params.sort_order) query.append('sort_order', params.sort_order)
    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())
    
    const response = await $fetch<CareerApiResponse>(`${config.public.apiBaseUrl}/api/v1/careers/search?${query.toString()}`)
    return response
  }

  const getCareerStats = async (): Promise<CareerStatsResponse> => {
    const response = await $fetch<CareerStatsResponse>(`${config.public.apiBaseUrl}/api/v1/careers/stats`)
    return response
  }

  return {
    getCareers,
    getCareerBySlug,
    getFeaturedCareers,
    searchCareers,
    getCareerStats
  }
}