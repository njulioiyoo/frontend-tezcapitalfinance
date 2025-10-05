<script setup lang="ts">
import type { CareerDetailResponse } from '~/composables/useCareers'

const route = useRoute()
const slug = route.params.id as string

const { getCareerBySlug } = useCareers()
const { careerApplicationEmail, fetchConfiguration } = useConfiguration()

// Use asyncData for proper SSR error handling
const { data: career, pending, error } = await useLazyAsyncData(
  `career-${slug}`,
  async () => {
    try {
      // Fetch configuration and career detail in parallel
      await fetchConfiguration()
      const careerResponse = await getCareerBySlug(slug)
      
      // If no career data, this will automatically throw 404 from API
      return careerResponse
    } catch (err: any) {
      // Log error for debugging
      console.error('Career fetch error:', err)
      
      // Throw 404 for any error (job not found, network issues, etc.)
      throw createError({
        statusCode: 404,
        statusMessage: 'Job not found'
      })
    }
  }
)

// If there's still an error after data fetch, throw 404
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job not found'
  })
}

// Reactive state for UI interactions
const isApplying = ref(false)
const showSuccessMessage = ref(false)




// Generate mailto link for job application
const generateMailtoLink = computed(() => {
  if (!career.value?.data || !careerApplicationEmail.value) {
    return '#'
  }

  const subject = `Lamaran Kerja - ${career.value.data.title_id}`
  const body = `Yth. HRD TEZ Capital Finance,

Saya tertarik untuk melamar posisi ${career.value.data.title_id} di departemen ${career.value.data.department_id}.

Berikut adalah informasi singkat mengenai diri saya:
- Nama: [Nama Lengkap]
- Email: [Email]
- Telepon: [Nomor Telepon]
- Pengalaman: [Pengalaman Kerja]

Saya telah melampirkan CV dan dokumen pendukung lainnya untuk pertimbangan Bapak/Ibu.

Terima kasih atas waktu dan perhatiannya.

Hormat saya,
[Nama Lengkap]`

  return `mailto:${careerApplicationEmail.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

// Handle apply action with loading state
const handleApplyClick = async () => {
  if (!careerApplicationEmail.value) {
    alert('Email untuk lamaran belum dikonfigurasi. Silakan hubungi administrator.')
    return
  }

  if (!generateMailtoLink.value || generateMailtoLink.value === '#') {
    return
  }

  try {
    isApplying.value = true
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Open email client
    window.location.href = generateMailtoLink.value
    
    // Show success message
    setTimeout(() => {
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }, 1000)
    
  } catch (error) {
    console.error('Error opening email client:', error)
    alert('Gagal membuka email client. Silakan coba lagi.')
  } finally {
    // Reset loading state after delay
    setTimeout(() => {
      isApplying.value = false
    }, 1500)
  }
}


// Dynamic head based on career data
watchEffect(() => {
  if (career.value?.data) {
    const careerData = career.value.data
    useHead({
      title: `${careerData.title_id} - TEZ Capital Finance`,
      meta: [
        { 
          name: 'description', 
          content: `Detail lowongan pekerjaan ${careerData.title_id} di TEZ Capital Finance. Bergabunglah dengan tim profesional kami di departemen ${careerData.department_id}.` 
        }
      ]
    })
  }
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <div class="max-w-4xl mx-auto">
          <!-- Loading Skeleton -->
          <div class="animate-pulse">
            <div class="bg-gray-200 h-6 w-20 mb-6 rounded"></div>
            <div class="mb-8 pb-6 border-b border-grey">
              <div class="bg-gray-200 h-10 w-3/4 mx-auto rounded"></div>
            </div>
            <div class="space-y-8">
              <div v-for="n in 4" :key="n">
                <div class="bg-gray-200 h-6 w-48 mb-4 rounded"></div>
                <div class="space-y-2">
                  <div class="bg-gray-200 h-4 w-full rounded"></div>
                  <div class="bg-gray-200 h-4 w-5/6 rounded"></div>
                  <div class="bg-gray-200 h-4 w-4/6 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content State -->
    <section v-else-if="career?.data" class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <!-- Back Button - di pojok kiri atas -->
        <NuxtLink
          to="/join-us/careers"
          class="flex items-center gap-2 text-base text-red-100 mb-6 hover:text-red-50 transition-colors duration-200"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          Kembali
        </NuxtLink>
        
        <div class="max-w-4xl mx-auto">
          
          <!-- Job Title -->
          <div class="mb-8 pb-6 border-b border-grey">
            <h1 class="xl:text-4xl text-2xl text-black-100 font-bold text-center">
              {{ career.data.title_id }}
            </h1>
          </div>
          <!-- Content Sections -->
          <div class="space-y-8">
            <!-- About the Role -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">About the Role</h2>
              <div class="text-base text-black-100 leading-relaxed" v-html="career.data.content_id"></div>
            </div>
            
            <!-- What You Will Need -->
            <div v-if="career.data.requirements_id">
              <h2 class="text-xl font-bold text-black-100 mb-4">What You Will Need</h2>
              <div class="text-base text-black-100 leading-relaxed" v-html="career.data.requirements_id"></div>
            </div>
            
            <!-- What We Offer -->
            <div v-if="career.data.benefits_id">
              <h2 class="text-xl font-bold text-black-100 mb-4">What We Offer</h2>
              <div class="text-base text-black-100 leading-relaxed" v-html="career.data.benefits_id"></div>
            </div>
            
            <!-- About the Team -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">About the Team</h2>
              <p class="text-base text-black-100 leading-relaxed">
                Bergabunglah dengan tim {{ career.data.department_id }} kami yang berdedikasi dan berkembang pesat. Kami berkomitmen untuk menciptakan lingkungan kerja yang kolaboratif dan inovatif dimana setiap anggota tim dapat berkembang dan memberikan kontribusi terbaik mereka.
              </p>
            </div>
            
            <!-- About TEZ Capital -->
            <div>
              <h2 class="text-xl font-bold text-black-100 mb-4">About TEZ Capital</h2>
              <p class="text-base text-black-100 leading-relaxed">
                TEZ Capital & Finance adalah perusahaan pembiayaan terkemuka yang berkomitmen memberikan solusi finansial terbaik bagi mitra bisnis kami. Dengan fokus pada inovasi, integritas, dan layanan unggul, kami terus berkembang dan mencari talenta terbaik untuk bergabung dalam perjalanan pertumbuhan kami.
              </p>
            </div>
          </div>
          <!-- Footer Section -->
          <div class="mt-12 pt-8 border-t border-grey">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div>
                  <span class="text-sm text-divider font-medium">Departemen</span>
                  <p class="text-black-100 font-semibold">{{ career.data.department_id }}</p>
                </div>
                <div>
                  <span class="text-sm text-divider font-medium">Lokasi</span>
                  <p class="text-black-100 font-semibold">{{ career.data.location_id }}</p>
                </div>
              </div>
              
              <button
                @click="handleApplyClick"
                :disabled="isApplying || !careerApplicationEmail"
                :title="!careerApplicationEmail ? 'Email untuk lamaran belum dikonfigurasi' : `Kirim lamaran ke ${careerApplicationEmail}`"
                :class="[
                  'relative overflow-hidden rounded-full py-3 px-8 font-bold text-white text-base w-full xl:w-auto transition-all duration-300 transform group',
                  isApplying 
                    ? 'bg-red-75 cursor-not-allowed scale-95' 
                    : 'bg-red-100 hover:bg-red-75 hover:scale-105 active:scale-95 hover:shadow-lg',
                  !careerApplicationEmail ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <!-- Loading overlay -->
                <div 
                  v-if="isApplying" 
                  class="absolute inset-0 bg-red-75 flex items-center justify-center"
                >
                  <div class="flex items-center gap-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span class="text-sm">Membuka Email...</span>
                  </div>
                </div>
                
                <!-- Default content -->
                <div :class="{ 'opacity-0': isApplying }">
                  <div class="flex items-center justify-center gap-2">
                    <Icon name="mdi:email-send" class="w-5 h-5" />
                    <span>Lamar Sekarang</span>
                  </div>
                </div>
                
                <!-- Ripple effect -->
                <div 
                  v-if="!isApplying"
                  class="absolute inset-0 rounded-full opacity-0 bg-white transform scale-0 group-hover:scale-110 group-hover:opacity-10 group-active:scale-100 group-active:opacity-20 transition-all duration-300"
                ></div>
                
                <!-- Shine effect on hover -->
                <div 
                  v-if="!isApplying && careerApplicationEmail"
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div 
        v-if="showSuccessMessage"
        class="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-600">
          <div class="flex items-center gap-3">
            <Icon name="mdi:check-circle" class="w-6 h-6 text-green-100" />
            <div>
              <p class="font-semibold">Email Client Dibuka!</p>
              <p class="text-sm text-green-100">Silakan lengkapi dan kirim lamaran Anda.</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>