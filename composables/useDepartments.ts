export interface Department {
  id: number
  name_id: string
  name_en: string
  slug: string
  description_id?: string
  description_en?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DepartmentApiResponse {
  success: boolean
  data: Department[]
  message?: string
}

export const useDepartments = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get all active departments
   */
  const getActiveDepartments = async (): Promise<DepartmentApiResponse> => {
    try {
      const response = await $fetch<DepartmentApiResponse>(
        `${config.public.apiBaseUrl}/api/v1/master/departments/active`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      )
      return response
    } catch (error) {
      console.error('Failed to fetch active departments:', error)
      return {
        success: false,
        data: [],
        message: 'Failed to fetch departments'
      }
    }
  }

  return {
    getActiveDepartments
  }
}



