export interface Location {
  id: number
  name_id: string
  name_en: string
  slug: string
  description_id?: string
  description_en?: string
  city?: string
  province?: string
  country: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface LocationApiResponse {
  success: boolean
  data: Location[]
  message?: string
}

export const useLocations = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get all active locations
   */
  const getActiveLocations = async (): Promise<LocationApiResponse> => {
    try {
      const response = await $fetch<LocationApiResponse>(
        `${config.public.apiBaseUrl}/api/v1/master/locations/active`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      )
      return response
    } catch (error) {
      console.error('Failed to fetch active locations:', error)
      return {
        success: false,
        data: [],
        message: 'Failed to fetch locations'
      }
    }
  }

  return {
    getActiveLocations
  }
}


