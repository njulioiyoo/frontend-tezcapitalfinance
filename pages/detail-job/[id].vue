<script setup lang="ts">
const route = useRoute()
const jobId = parseInt(route.params.id as string)

const jobsStore = useJobsStore()

const isModalOpen = ref(false)

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  experience: '',
  coverLetter: '',
  resume: null as File | null
})

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formData.value = {
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    resume: null
  }
}

const submitApplication = () => {
  console.log('Application submitted:', {
    job: job.value,
    applicant: formData.value
  })
  
  alert('Lamaran Anda telah berhasil dikirim!')
  closeModal()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.value.resume = target.files[0]
  }
}

const job = computed(() => {
  return jobsStore.getJobById(jobId)
})

if (!job.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job not found'
  })
}

useHead({
  title: `${job.value?.title || 'Job Detail'} - TEZ Capital Finance`,
  meta: [
    { name: 'description', content: `Detail lowongan pekerjaan ${job.value?.title || ''} di TEZ Capital Finance. Bergabunglah dengan tim profesional kami.` }
  ]
})
</script>

<template>
  <div>
    <Jumbotron label="Jadi Bagian Dari TEZ Capital" img="/img/dummy1.jpg" />
    
    <section class="py-8 xl:py-12 bg-white">
      <div class="px-3 xl:px-15">
        <div class="relative">
          <NuxtLink
            to="/join-us"
            class="flex items-center gap-2 text-base text-red-100 mb-6 xl:hidden hover:text-red-50 transition-colors duration-200"
          >
            <Icon name="mdi:chevron-left" class="size-4" />
            Back
          </NuxtLink>
          
          <div class="mb-6 xl:mb-12 pb-6 border-b border-grey">
            <h1 class="xl:text-5xl text-2xl text-black-100 text-center font-bold">
              {{ job?.title }}
            </h1>
          </div>
          <div class="flex flex-col gap-6 xl:gap-9">
            <div class="flex flex-col gap-3 xl:gap-4">
              <h2 class="xl:text-4xl text-xl text-black-100 font-bold">About the Role</h2>
              <p class="text-base xl:text-lg text-divider leading-relaxed">
                {{ job?.description }}
              </p>
            </div>
            
            <div class="flex flex-col gap-3 xl:gap-4">
              <h2 class="xl:text-4xl text-xl text-black-100 font-bold">What You Will Do</h2>
              <ul class="list-disc list-inside text-base xl:text-lg text-divider leading-relaxed space-y-2">
                <li v-for="responsibility in job?.responsibilities" :key="responsibility">
                  {{ responsibility }}
                </li>
              </ul>
            </div>
            
            <div class="flex flex-col gap-3 xl:gap-4">
              <h2 class="xl:text-4xl text-xl text-black-100 font-bold">What You Will Need</h2>
              <ul class="list-disc list-inside text-base xl:text-lg text-divider leading-relaxed space-y-2">
                <li v-for="requirement in job?.requirements" :key="requirement">
                  {{ requirement }}
                </li>
              </ul>
            </div>
            
            <div class="flex flex-col gap-3 xl:gap-4">
              <h2 class="xl:text-4xl text-xl text-black-100 font-bold">Benefits</h2>
              <ul class="list-disc list-inside text-base xl:text-lg text-divider leading-relaxed space-y-2">
                <li v-for="benefit in job?.benefits" :key="benefit">
                  {{ benefit }}
                </li>
              </ul>
            </div>
            
            <div class="flex flex-col gap-3 xl:gap-4">
              <h2 class="xl:text-4xl text-xl text-black-100 font-bold">About TEZ Capital</h2>
              <p class="text-base xl:text-lg text-divider leading-relaxed">
                {{ jobsStore.companyInfo.description }}
              </p>
            </div>
          </div>
          <div class="mt-8 xl:mt-12 pt-6 xl:pt-8 border-t border-grey">
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 xl:gap-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 flex-1">
                <div class="flex flex-col gap-1">
                  <p class="text-divider text-sm xl:text-base">Departemen</p>
                  <p class="text-black-100 text-base xl:text-lg font-semibold">
                    {{ job?.department }}
                  </p>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-divider text-sm xl:text-base">Lokasi</p>
                  <p class="text-black-100 text-base xl:text-lg font-semibold">
                    {{ job?.location }}
                  </p>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-divider text-sm xl:text-base">Type</p>
                  <p class="text-black-100 text-base xl:text-lg font-semibold capitalize">
                    {{ job?.type }}
                  </p>
                </div>
              </div>
              
              <button
                @click="openModal"
                class="rounded-full py-3 px-8 xl:px-12 bg-red-100 hover:bg-red-50 hover:text-red-100 transition-all duration-300 font-bold text-white text-lg xl:text-xl w-full xl:w-auto"
              >
                Lamar Sekarang
              </button>
            </div>
          </div>
          
          <NuxtLink to="/join-us" class="hidden xl:block">
            <Icon name="mdi:chevron-left" class="size-8 absolute top-8 left-0 text-red-100 hover:text-red-50 transition-colors duration-200" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 backdrop-blur-sm bg-white/20" @click="closeModal"></div>
 
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Lamar Pekerjaan</h3>
                <p class="text-gray-600 mt-1">{{ job?.title }} - {{ job?.department }}</p>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:close" class="w-6 h-6" />
              </button>
            </div>

            <div class="p-6 bg-gray-50 border-b border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-500">Posisi:</span>
                  <p class="font-semibold text-gray-900">{{ job?.title }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Departemen:</span>
                  <p class="font-semibold text-gray-900">{{ job?.department }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Lokasi:</span>
                  <p class="font-semibold text-gray-900">{{ job?.location }}</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="submitApplication" class="p-6 space-y-6">
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  v-model="formData.fullName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon <span class="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
                  Pengalaman Kerja
                </label>
                <select
                  id="experience"
                  v-model="formData.experience"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Pilih pengalaman kerja</option>
                  <option value="fresh-graduate">Fresh Graduate</option>
                  <option value="1-3">1-3 Tahun</option>
                  <option value="3-5">3-5 Tahun</option>
                  <option value="5-10">5-10 Tahun</option>
                  <option value="10+">Lebih dari 10 Tahun</option>
                </select>
              </div>

              <div>
                <label for="resume" class="block text-sm font-medium text-gray-700 mb-2">
                  Upload CV/Resume <span class="text-red-500">*</span>
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  @change="handleFileUpload"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                <p class="text-xs text-gray-500 mt-1">Format yang didukung: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div>
                <label for="coverLetter" class="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  v-model="formData.coverLetter"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini..."
                ></textarea>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Kirim Lamaran
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>