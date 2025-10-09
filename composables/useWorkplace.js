export const useWorkplace = () => {
  const apiStore = useApiStore()

  const getWorkplaces = async (params = {}) => {
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

      const url = `api/v1/workplace${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
      const response = await apiStore.apiCall(url)
      
      return {
        success: response?.success || false,
        data: response?.data || [],
        message: response?.message || '',
        categories: response?.categories || {}
      }
    } catch (error) {
      console.error('Error fetching workplace data:', error)
      return {
        success: false,
        data: [],
        message: error?.message || 'Failed to fetch workplace data',
        categories: {}
      }
    }
  }

  const getFeaturedWorkplaces = async (limit = 6) => {
    return await getWorkplaces({ featured: true, limit })
  }

  return {
    getWorkplaces,
    getFeaturedWorkplaces
  }
}