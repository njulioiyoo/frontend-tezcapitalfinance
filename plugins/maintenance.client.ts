export default defineNuxtPlugin(() => {
  console.log('🔧 Maintenance plugin starting...')
  
  // Skip on server side
  if (process.server) {
    console.log('🔧 Skipping maintenance check on server side')
    return
  }

  console.log('🔧 Maintenance plugin running on client side')
  
  // Use nextTick to ensure everything is ready
  nextTick(async () => {
    try {
      console.log('🔧 Starting async maintenance check...')
      
      // Get config directly without using stores/composables
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl
      
      console.log('🔧 API Base URL:', baseURL)
      
      if (!baseURL) {
        console.warn('⚠️ No API base URL configured')
        return
      }
      
      // Direct fetch to avoid store/composable issues in plugin
      const url = `${baseURL}/api/v1/configurations?lang=id&_t=${Date.now()}`
      console.log('🔧 Fetching:', url)
      
      const response = await $fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        server: false,
        default: () => null
      })
      
      console.log('🔧 Maintenance API response type:', typeof response)
      console.log('🔧 Maintenance API response:', response)
      
      // Handle response structure
      let data = response
      if (response && typeof response === 'object') {
        if (response.data) {
          data = response.data
        } else if (response.success && response.data) {
          data = response.data
        }
      }
      
      console.log('🔧 Processed maintenance data:', data)
      
      // Check if maintenance mode is enabled
      if (data && data.maintenance && data.maintenance.maintenance_mode_enabled && data.maintenance.maintenance_mode_enabled.value === true) {
        console.log('🚫 MAINTENANCE MODE DETECTED - redirecting')
        
        // Format estimated time if it's a datetime
        let estimatedTime = data.maintenance.maintenance_end_time?.value || data.maintenance.maintenance_end_time || ''
        if (estimatedTime && estimatedTime.includes('T')) {
          try {
            const date = new Date(estimatedTime)
            estimatedTime = date.toLocaleString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          } catch (e) {
            console.warn('Failed to parse datetime:', estimatedTime)
          }
        }
        
        const config = {
          enabled: true,
          title: data.maintenance.maintenance_title?.value || data.maintenance.maintenance_title || '',
          message: data.maintenance.maintenance_message?.value || data.maintenance.maintenance_message || '',
          estimated_time: estimatedTime,
          contact_email: data.maintenance.maintenance_contact_email?.value || data.maintenance.maintenance_contact_email || ''
        }
        
        console.log('🔧 Maintenance config:', config)
        
        // Store maintenance status globally
        const maintenanceStatus = useState('maintenance-status', () => ({
          checked: true,
          enabled: true,
          config: config
        }))
        
        // Replace entire page with maintenance HTML
        console.log('🚫 Replacing page with maintenance mode')
        
        document.body.innerHTML = `
          <div style="min-height: 100vh; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; padding: 1rem; font-family: system-ui, -apple-system, sans-serif;">
            <div style="max-width: 32rem; width: 100%; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 2rem;">
                <img src="/img/logo.png" alt="TEZ Capital & Finance" style="height: 4rem; margin: 0 auto;" />
              </div>

              <!-- Maintenance Icon -->
              <div style="margin-bottom: 2rem;">
                <div style="width: 6rem; height: 6rem; margin: 0 auto; background-color: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 3rem; height: 3rem; color: #d97706;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
              </div>

              <!-- Title -->
              <h1 style="font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">
                ${config.title || 'Situs Sedang Dalam Pemeliharaan'}
              </h1>

              <!-- Message -->
              <p style="font-size: 1.125rem; color: #1f2937; margin-bottom: 2rem; line-height: 1.6;">
                ${config.message || 'Kami sedang melakukan pemeliharaan terjadwal untuk meningkatkan layanan. Mohon coba lagi nanti.'}
              </p>

              <!-- Estimated Time -->
              ${config.estimated_time ? `
              <div style="background-color: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                  <svg style="width: 1.25rem; height: 1.25rem; color: #2563eb; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
                    Estimasi Waktu Selesai
                  </span>
                </div>
                <p style="font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 0;">
                  ${config.estimated_time}
                </p>
              </div>
              ` : ''}

              <!-- Contact Email -->
              ${config.contact_email ? `
              <div style="background-color: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                  <svg style="width: 1.25rem; height: 1.25rem; color: #059669; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span style="font-size: 0.875rem; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
                    Hubungi Kami
                  </span>
                </div>
                <a href="mailto:${config.contact_email}" style="font-size: 1.25rem; font-weight: 600; color: #2563eb; text-decoration: none;">
                  ${config.contact_email}
                </a>
              </div>
              ` : ''}

              <!-- Refresh Button -->
              <button onclick="window.location.reload()" style="background-color: #dc2626; color: white; font-weight: 500; padding: 0.75rem 2rem; border-radius: 0.5rem; border: none; cursor: pointer; transition: background-color 0.2s;">
                Muat Ulang Halaman
              </button>

              <!-- Footer -->
              <div style="margin-top: 3rem; text-align: center;">
                <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">
                  © ${new Date().getFullYear()} TEZ Capital & Finance. Semua hak dilindungi.
                </p>
              </div>
            </div>
          </div>
        `
      } else {
        console.log('✅ Maintenance mode is disabled')
        
        // Store maintenance status as disabled
        const maintenanceStatus = useState('maintenance-status', () => ({
          checked: true,
          enabled: false,
          config: null
        }))
      }
    } catch (error: any) {
      console.error('🔧 Maintenance check error:', error)
      
      // Re-throw maintenance errors
      if (error.statusCode === 503 && error.data?.maintenance) {
        throw error
      }
      
      // Handle specific API errors
      if (error.message && error.message.includes('Unexpected token')) {
        console.warn('⚠️ API returned HTML instead of JSON - probably 404 or server error')
        console.warn('⚠️ Check if API endpoint /api/v1/configurations exists and returns JSON')
      } else if (error.message && error.message.includes('fetch')) {
        console.warn('⚠️ Network error accessing API')
      }
      
      // Log other errors but don't block
      console.warn('⚠️ Non-fatal maintenance check error, continuing normally')
    }
  })
})