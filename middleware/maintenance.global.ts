export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (process.server) return


  // Check global maintenance status
  const maintenanceStatus = useState('maintenance-status', () => ({
    checked: false,
    enabled: false,
    config: null
  }))


  // If maintenance mode is enabled, block access
  if (maintenanceStatus.value.enabled && maintenanceStatus.value.config) {
    
    // Show maintenance page immediately
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable - Maintenance Mode',
      fatal: true,
      data: {
        maintenance: true,
        config: maintenanceStatus.value.config
      }
    })
  }

})