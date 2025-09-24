export interface ReportItem {
  id: number
  year: string
  month?: string
  desc: string
  desc_id?: string
  desc_en?: string
  file_url?: string
  link?: string
  file_size?: string
  created_at: string
}

export interface FinancialReportTab {
  title: string
  title_id?: string
  title_en?: string
  value: string
  subKeuangan: ReportItem[]
}

export interface FinancialReportsResponse {
  'all-category': FinancialReportTab
  'bulanan': FinancialReportTab
  'triwulan': FinancialReportTab
}

export interface ReportsApiResponse {
  success: boolean
  data: FinancialReportsResponse | ReportItem[]
  pagination?: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    has_more: boolean
  }
}

export const useReports = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl || 'http://cms.tez-capital.web.local'

  // State
  const financialReports = ref<FinancialReportsResponse | null>(null)
  const annualReports = ref<ReportItem[]>([])
  const isLoading = ref(false)
  const error = ref<any>(null)
  const financialPagination = ref<any>(null)
  const annualPagination = ref<any>(null)

  // Fetch financial reports
  const fetchFinancialReports = async (params: {
    period?: string
    year?: number
    month?: number
    quarter?: number
    search?: string
    page?: number
    limit?: number
    lang?: string
  } = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const queryParams = new URLSearchParams()
      
      if (params.period && params.period !== 'all') {
        queryParams.append('period', params.period)
      }
      if (params.year) {
        queryParams.append('year', params.year.toString())
      }
      if (params.month) {
        queryParams.append('month', params.month.toString())
      }
      if (params.quarter) {
        queryParams.append('quarter', params.quarter.toString())
      }
      if (params.search) {
        queryParams.append('search', params.search)
      }
      if (params.page) {
        queryParams.append('page', params.page.toString())
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString())
      }
      
      // Add language parameter
      if (params.lang) {
        queryParams.append('lang', params.lang)
      }

      const url = `${baseURL}/api/v1/reports/financial${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('🚀 Fetching financial reports from URL:', url)
      const response: ReportsApiResponse = await $fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        server: false
      })
      console.log('📈 Financial reports response:', response)

      if (response.success) {
        financialReports.value = response.data as FinancialReportsResponse
        financialPagination.value = response.pagination
        console.log('💾 Financial reports stored in state:', {
          allCategoryCount: financialReports.value['all-category']?.subKeuangan?.length,
          allCategoryIds: financialReports.value['all-category']?.subKeuangan?.map(r => r.id),
          pagination: financialPagination.value
        })
        return response
      } else {
        throw new Error('Failed to fetch financial reports')
      }

    } catch (err: any) {
      error.value = err
      console.error('Error fetching financial reports:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fetch annual reports
  const fetchAnnualReports = async (params: {
    year?: number
    search?: string
    page?: number
    limit?: number
    lang?: string
  } = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const queryParams = new URLSearchParams()
      
      if (params.year) {
        queryParams.append('year', params.year.toString())
      }
      if (params.search) {
        queryParams.append('search', params.search)
      }
      if (params.page) {
        queryParams.append('page', params.page.toString())
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString())
      }
      
      // Add language parameter
      if (params.lang) {
        queryParams.append('lang', params.lang)
      }

      const url = `${baseURL}/api/v1/reports/annual${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response: ReportsApiResponse = await $fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.success) {
        annualReports.value = response.data as ReportItem[]
        annualPagination.value = response.pagination
        return response
      } else {
        throw new Error('Failed to fetch annual reports')
      }

    } catch (err: any) {
      error.value = err
      console.error('Error fetching annual reports:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single report details
  const fetchReport = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/api/v1/reports/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (err: any) {
      console.error('Error fetching report:', err)
      throw err
    }
  }

  // Download report
  const downloadReport = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/api/v1/reports/${id}/download`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.success && response.data.download_url) {
        // Open download URL in new tab
        window.open(response.data.download_url, '_blank')
        return response.data
      } else {
        throw new Error('Download URL not available')
      }
    } catch (err: any) {
      console.error('Error downloading report:', err)
      throw err
    }
  }

  return {
    // State
    financialReports: readonly(financialReports),
    annualReports: readonly(annualReports),
    isLoading: readonly(isLoading),
    error: readonly(error),
    financialPagination: readonly(financialPagination),
    annualPagination: readonly(annualPagination),

    // Methods
    fetchFinancialReports,
    fetchAnnualReports,
    fetchReport,
    downloadReport
  }
}