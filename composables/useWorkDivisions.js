export const useWorkDivisions = () => {
  const apiStore = useApiStore()

  const getWorkDivisions = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.featured) {
        queryParams.append('featured', '1')
      }
      
      if (params.category) {
        queryParams.append('category', params.category)
      }
      
      if (params.search) {
        queryParams.append('search', params.search)
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit)
      }

      if (params.page) {
        queryParams.append('page', params.page)
      }

      const endpoint = `api/v1/work-divisions${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
      const response = await apiStore.apiCall(endpoint)
      
      return {
        success: response?.success || false,
        data: response?.data || [],
        message: response?.message || '',
        categories: response?.categories || {}
      }
    } catch (error) {
      console.error('Error fetching work divisions data:', error)
      return {
        success: false,
        data: [],
        message: error?.message || 'Failed to fetch work divisions data',
        categories: {}
      }
    }
  }

  const getFeaturedWorkDivisions = async (limit = 12) => {
    return await getWorkDivisions({ limit })
  }

  const getWorkDivisionsPaginated = async (page = 1, limit = 3) => {
    return await getWorkDivisions({ page, limit })
  }

  return {
    getWorkDivisions,
    getFeaturedWorkDivisions,
    getWorkDivisionsPaginated
  }
}