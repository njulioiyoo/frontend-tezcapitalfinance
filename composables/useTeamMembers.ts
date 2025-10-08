import type { Ref } from 'vue'

export interface TeamMember {
  id: number
  type: string
  category: string
  slug: string
  title_id: string
  title_en?: string
  department_id: string
  department_en?: string
  featured_image?: string
  featured_image_url?: string
  is_published: boolean
  is_featured: boolean
  sort_order?: number
  status: string
  published_at?: string
  created_at: string
  updated_at: string
  view_count?: number
}

export interface TeamMemberResponse {
  success: boolean
  message: string
  data: TeamMember[]
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

export interface TeamMemberDetailResponse {
  success: boolean
  message: string
  data: TeamMember
}

export const useTeamMembers = () => {
  const config = useRuntimeConfig()
  const apiStore = useApiStore()

  // State
  const teamMembers = ref<TeamMember[]>([])
  const featuredTeamMembers = ref<TeamMember[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Get all team members
  const getTeamMembers = async (params: {
    category?: string
    department?: string
    featured?: boolean
    per_page?: number
    page?: number
  } = {}): Promise<TeamMemberResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const queryParams = new URLSearchParams()
      if (params.category) queryParams.append('category', params.category)
      if (params.department) queryParams.append('department', params.department)
      if (params.featured) queryParams.append('featured', 'true')
      if (params.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params.page) queryParams.append('page', params.page.toString())

      const url = `${apiStore.baseURL}/api/v1/team-members${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }).then(res => res.json()) as TeamMemberResponse

      if (response.success) {
        teamMembers.value = response.data
      }

      return response
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch team members'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get featured team members
  const getFeaturedTeamMembers = async (limit: number = 5): Promise<TeamMemberResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const url = `${apiStore.baseURL}/api/v1/team-members/featured?limit=${limit}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }).then(res => res.json()) as TeamMemberResponse

      if (response.success && response.data) {
        featuredTeamMembers.value = response.data
      } else {
        featuredTeamMembers.value = []
      }

      return response
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch featured team members'
      featuredTeamMembers.value = []
      
      // Return empty response instead of throwing
      return {
        success: false,
        message: error.value,
        data: []
      }
    } finally {
      isLoading.value = false
    }
  }

  // Get team member by slug
  const getTeamMemberBySlug = async (slug: string): Promise<TeamMemberDetailResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const url = `${apiStore.baseURL}/api/v1/team-members/${slug}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }).then(res => res.json()) as TeamMemberDetailResponse

      return response
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch team member'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Search team members
  const searchTeamMembers = async (params: {
    q?: string
    category?: string
    department?: string
    per_page?: number
    page?: number
  } = {}): Promise<TeamMemberResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const queryParams = new URLSearchParams()
      if (params.q) queryParams.append('q', params.q)
      if (params.category) queryParams.append('category', params.category)
      if (params.department) queryParams.append('department', params.department)
      if (params.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params.page) queryParams.append('page', params.page.toString())

      const url = `${apiStore.baseURL}/api/v1/team-members/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }).then(res => res.json()) as TeamMemberResponse

      if (response.success) {
        teamMembers.value = response.data
      }

      return response
    } catch (err: any) {
      error.value = err?.message || 'Failed to search team members'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get team member statistics
  const getTeamMemberStats = async () => {
    try {
      isLoading.value = true
      error.value = null

      const url = `${apiStore.baseURL}/api/v1/team-members/stats`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      return response
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch team member statistics'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Helper function to get image URL
  const getTeamMemberImageUrl = (teamMember: TeamMember): string => {
    if (teamMember.featured_image) {
      // API now returns full URL, so we can use it directly
      return teamMember.featured_image
    }
    
    return '/img/team/placeholder.jpg'
  }

  // Helper function to get team member name based on locale
  const getTeamMemberName = (teamMember: TeamMember, locale: string = 'id'): string => {
    if (locale === 'en' && teamMember.title_en) {
      return teamMember.title_en
    }
    return teamMember.title_id
  }

  // Helper function to get department name based on locale
  const getDepartmentName = (teamMember: TeamMember, locale: string = 'id'): string => {
    if (locale === 'en' && teamMember.department_en) {
      return teamMember.department_en
    }
    return teamMember.department_id
  }

  return {
    // State
    teamMembers: readonly(teamMembers),
    featuredTeamMembers: readonly(featuredTeamMembers),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    getTeamMembers,
    getFeaturedTeamMembers,
    getTeamMemberBySlug,
    searchTeamMembers,
    getTeamMemberStats,

    // Helper functions
    getTeamMemberImageUrl,
    getTeamMemberName,
    getDepartmentName,
  }
}
