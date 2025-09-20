export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (process.server) return

  console.log('🔧 Middleware: Checking route:', to.path)

  // Check global maintenance status
  const maintenanceStatus = useState('maintenance-status', () => ({
    checked: false,
    enabled: false,
    config: null
  }))

  console.log('🔧 Middleware: Current maintenance status:', maintenanceStatus.value)

  // If maintenance mode is enabled, block access
  if (maintenanceStatus.value.enabled && maintenanceStatus.value.config) {
    console.log('🚫 Middleware: Maintenance mode is active, blocking access to:', to.path)
    
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

  console.log('✅ Middleware: Normal access allowed for:', to.path)
})