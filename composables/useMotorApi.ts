export interface MotorItem {
  id: number
  name: string
  price: number
  area: string
  period: string
  installment_plans: InstallmentPlan[]
}

export interface InstallmentPlan {
  dp_percent: number
  dp_amount: number
  installments: {
    [key: string]: number // e.g., "11_months": 1967000
  }
}

export interface CalculationResult {
  motor: {
    id: number
    name: string
    price: string
    area: string
    period: string
  }
  calculation: {
    motor_price: string
    dp_amount: number
    dp_percent: number
    tenor_months: number
    monthly_installment: number
    total_installment: number
    total_payment: number
    total_interest: number
    matched_plan: {
      dp_percent: number
      dp_amount: number
    }
  }
}

export interface InstallmentOptions {
  motor: {
    id: number
    name: string
    price: string
    area: string
    period: string
  }
  installment_options: {
    dp_percent: number
    dp_amount: number
    installments: {
      tenor_months: number
      monthly_amount: number
      total_installment: number
      total_payment: number
    }[]
  }[]
}

export const useMotorApi = () => {
  const apiStore = useApiStore()
  
  const isLoading = ref(false)
  const error = ref<any>(null)
  
  // Get all motors
  const getMotors = async (filters?: { area?: string; period?: string; search?: string }) => {
    try {
      isLoading.value = true
      error.value = null
      
      const params = new URLSearchParams()
      if (filters?.area) params.append('area', filters.area)
      if (filters?.period) params.append('period', filters.period)
      if (filters?.search) params.append('search', filters.search)
      
      const queryString = params.toString()
      const url = `api/v1/motors${queryString ? '?' + queryString : ''}`
      
      const response = await $fetch(url, {
        baseURL: apiStore.baseURL,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      return response.data as MotorItem[]
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Get available areas
  const getAreas = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch('api/v1/motors/areas', {
        baseURL: apiStore.baseURL,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      return response.data as string[]
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Get available periods
  const getPeriods = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch('api/v1/motors/periods', {
        baseURL: apiStore.baseURL,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      return response.data as string[]
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Calculate installment
  const calculateInstallment = async (motorId: number, dpAmount: number, tenorMonths: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch('api/v1/motors/calculate', {
        method: 'POST',
        baseURL: apiStore.baseURL,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          motor_id: motorId,
          dp_amount: dpAmount,
          tenor_months: tenorMonths
        }
      })
      
      
      return response.data as CalculationResult
    } catch (err: any) {
      
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Get installment options for a motor
  const getInstallmentOptions = async (motorId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch(`api/v1/motors/${motorId}/installment-options`, {
        baseURL: apiStore.baseURL,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      return response.data as InstallmentOptions
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Search motors
  const searchMotors = async (params: {
    name?: string
    area?: string
    min_price?: number
    max_price?: number
    per_page?: number
  }) => {
    try {
      isLoading.value = true
      error.value = null
      
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString())
        }
      })
      
      const response = await $fetch(`api/v1/motors/search?${searchParams.toString()}`, {
        baseURL: apiStore.baseURL,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      return {
        data: response.data as MotorItem[],
        pagination: response.pagination
      }
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading: readonly(isLoading),
    error: error, // Remove readonly to allow setting from component
    getMotors,
    getAreas,
    getPeriods,
    calculateInstallment,
    getInstallmentOptions,
    searchMotors
  }
}