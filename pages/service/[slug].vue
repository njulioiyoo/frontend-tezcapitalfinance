<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError } from "h3";
import type { ServiceItem } from '~/types/api';
import type { MotorItem } from '~/composables/useMotorApi';

const { t, locale } = useI18n();
const apiStore = useApiStore();
const motorApi = useMotorApi();
const route = useRoute();

// Get slug from route params
const slug = route.params.slug as string;

// Reactive data
const isLoading = ref(true);
const error = ref<any>(null);
const serviceItem = ref<ServiceItem | null>(null);

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getLocalizedTitle = (item: ServiceItem) => {
  return locale.value === 'en' && item.title_en ? item.title_en : item.title_id;
};

const getLocalizedContent = (item: ServiceItem) => {
  return locale.value === 'en' && item.content_en ? item.content_en : item.content_id;
};

const getLocalizedExcerpt = (item: ServiceItem) => {
  return locale.value === 'en' && item.excerpt_en ? item.excerpt_en : item.excerpt_id;
};

const getLocalizedRequirements = (item: ServiceItem) => {
  return locale.value === 'en' && item.requirements_en ? item.requirements_en : item.requirements_id;
};

const getLocalizedBenefits = (item: ServiceItem) => {
  return locale.value === 'en' && item.benefits_en ? item.benefits_en : item.benefits_id;
};

// Fetch service detail
const fetchServiceDetail = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await apiStore.fetchServiceDetail(slug);
    serviceItem.value = response.data || response; // Handle different response structures
    
    // Set page title
    const title = getLocalizedTitle(serviceItem.value);
    useSeoMeta({
      title: title,
      description: getLocalizedExcerpt(serviceItem.value),
      ogTitle: title,
      ogDescription: getLocalizedExcerpt(serviceItem.value),
      ogImage: serviceItem.value.featured_image_url || '/img/services/1.png',
      twitterCard: 'summary_large_image',
    });
    
  } catch (err: any) {
    error.value = err;
    
    // If 404, throw a Nuxt error
    if (err.statusCode === 404 || err.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Service not found",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const retryFetch = () => {
  fetchServiceDetail();
};

// Lifecycle
onMounted(() => {
  fetchServiceDetail();
});

// Watch for route changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== slug) {
    fetchServiceDetail();
  }
});

// Dynamic accordion items based on service data
const accordionItems = computed(() => {
  if (!serviceItem.value) return [];
  
  const items = [];
  
  // Special case for pembiayaan-serbaguna - tidak ada accordion, return empty
  if (serviceItem.value.slug === 'pembiayaan-serbaguna') {
    return [];
  } else {
    // For other services, show Interest & Fees and Document List if data exists
    if (serviceItem.value.interest_rate || serviceItem.value.service_duration || 
        (serviceItem.value.interest_list_array && serviceItem.value.interest_list_array.length > 0)) {
      let content = '<div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300">';
      content += '<thead><tr class="bg-gray-100"><th class="border border-gray-300 px-4 py-2 text-left font-semibold">Item</th><th class="border border-gray-300 px-4 py-2 text-left font-semibold">Detail</th></tr></thead>';
      content += '<tbody>';
      
      if (serviceItem.value.interest_rate) {
        content += `<tr><td class="border border-gray-300 px-4 py-2 font-medium">Interest Rate</td><td class="border border-gray-300 px-4 py-2">${serviceItem.value.interest_rate}%</td></tr>`;
      }
      
      if (serviceItem.value.service_duration) {
        content += `<tr><td class="border border-gray-300 px-4 py-2 font-medium">Service Duration</td><td class="border border-gray-300 px-4 py-2">${serviceItem.value.service_duration}</td></tr>`;
      }
      
      if (serviceItem.value.interest_list_array && serviceItem.value.interest_list_array.length > 0) {
        serviceItem.value.interest_list_array.forEach((item, index) => {
          const parts = item.split(':');
          const label = parts[0]?.trim() || `Item ${index + 1}`;
          const value = parts[1]?.trim() || item;
          content += `<tr><td class="border border-gray-300 px-4 py-2 font-medium">${label}</td><td class="border border-gray-300 px-4 py-2">${value}</td></tr>`;
        });
      }
      
      content += '</tbody></table></div>';
      
      items.push({
        value: "interest-fees",
        title: "Interest & Fees",
        content: content
      });
    }
    
    // Document List section
    if (serviceItem.value.document_list_array && serviceItem.value.document_list_array.length > 0) {
      let content = '<div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300">';
      content += '<thead><tr class="bg-gray-100"><th class="border border-gray-300 px-4 py-2 text-left font-semibold">No</th><th class="border border-gray-300 px-4 py-2 text-left font-semibold">Document Required</th></tr></thead>';
      content += '<tbody>';
      
      serviceItem.value.document_list_array.forEach((doc, index) => {
        content += `<tr><td class="border border-gray-300 px-4 py-2 text-center font-medium">${index + 1}</td><td class="border border-gray-300 px-4 py-2">${doc}</td></tr>`;
      });
      
      content += '</tbody></table></div>';
      
      items.push({
        value: "document-list",
        title: "Document List",
        content: content
      });
    }
  }
  
  return items;
});

// Credit Simulation variables and functions
const creditCategories = ref([
  {
    img: "/img/credit/1.png",
    label: "Ponsel",
  },
  {
    img: "/img/credit/2.png", 
    label: "Peralatan Rumah Tangga",
  },
  {
    img: "/img/credit/3.png",
    label: "Gadget",
  },
  {
    img: "/img/credit/4.png",
    label: "Komputer dan Laptop",
  },
  {
    img: "/img/credit/5.png",
    label: "Motor",
  },
]);

const activeCategory = ref<string | null>(null);
const priceInput = ref('');
const dpInput = ref('');
const selectedVehicle = ref<MotorItem | null>(null);
const selectedDp = ref<{dp_percent: number, dp_amount: number} | null>(null);
const selectedTenor = ref<number | null>(null);
const monthlyPayment = ref(0);
const totalPayment = ref(0);
const calculationResult = ref<any>(null);
const isCalculating = ref(false);

// Dynamic data from API
const motors = ref<MotorItem[]>([]);
const areas = ref<string[]>([]);
const periods = ref<string[]>([]);

// Available tenors from motor data
const tenorOptions = ref([11, 17, 23, 29, 35]);

// Dynamic DP options based on selected motor
const dpOptions = computed(() => {
  if (!selectedVehicle.value || !selectedVehicle.value.installment_plans) {
    return [];
  }
  
  return selectedVehicle.value.installment_plans.map(plan => ({
    dp_percent: plan.dp_percent,
    dp_amount: plan.dp_amount,
    label: `${plan.dp_percent}% - ${formatCurrency(plan.dp_amount)}`
  }));
});

// Dynamic vehicle options from API
const vehicleOptions = computed(() => {
  return motors.value.map(motor => ({
    id: motor.id,
    name: motor.name,
    price: motor.price,
    area: motor.area,
    period: motor.period,
    installment_plans: motor.installment_plans
  }));
});

const toggleCategory = async (label: string) => {
  if (activeCategory.value === label) {
    activeCategory.value = null;
    // Reset form data
    resetForm();
  } else {
    activeCategory.value = label;
    resetForm();
    
    // Load motor data if Motor category is selected
    if (label === 'Motor') {
      await loadMotorData();
    }
  }
};

const resetForm = () => {
  priceInput.value = '';
  dpInput.value = '';
  selectedVehicle.value = null;
  selectedDp.value = null;
  selectedTenor.value = null;
  monthlyPayment.value = 0;
  totalPayment.value = 0;
  calculationResult.value = null;
};

const toggleTenor = (option: number) => {
  if (selectedTenor.value === option) {
    selectedTenor.value = null;
  } else {
    selectedTenor.value = option;
  }
  calculateSimulation();
};

const formatCurrency = (amount: number) => {
  if (amount === 0) return "Rp-";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Load motor data when category is selected
const loadMotorData = async () => {
  try {
    if (activeCategory.value === 'Motor') {
      const [motorsData, areasData, periodsData] = await Promise.all([
        motorApi.getMotors(),
        motorApi.getAreas(),
        motorApi.getPeriods()
      ]);
      
      motors.value = motorsData;
      areas.value = areasData;
      periods.value = periodsData;
    }
  } catch (error) {
    console.error('Failed to load motor data:', error);
  }
};

// Calculate simulation using API
const calculateSimulation = async () => {
  try {
    if (activeCategory.value === 'Motor') {
      // For motor category, use API calculation
      if (!selectedVehicle.value || !selectedDp.value || !selectedTenor.value) {
        monthlyPayment.value = 0;
        totalPayment.value = 0;
        calculationResult.value = null;
        return;
      }
      
      isCalculating.value = true;
      const result = await motorApi.calculateInstallment(
        selectedVehicle.value.id,
        selectedDp.value.dp_amount,
        selectedTenor.value
      );
      
      calculationResult.value = result;
      monthlyPayment.value = result.calculation.monthly_installment;
      totalPayment.value = result.calculation.total_payment;
      
    } else {
      // For other categories, use simple calculation
      const price = parseFloat(priceInput.value) || 0;
      const downPayment = parseFloat(dpInput.value) || 0;
      
      if (!selectedTenor.value || price === 0 || downPayment === 0) {
        monthlyPayment.value = 0;
        totalPayment.value = 0;
        return;
      }
      
      const loanAmount = price - downPayment;
      const tenorMonths = selectedTenor.value;
      const interestRate = 0.02; // 2% per month (example rate)
      
      // Simple calculation for non-motor categories
      const monthlyInterest = loanAmount * interestRate;
      monthlyPayment.value = (loanAmount + (monthlyInterest * tenorMonths)) / tenorMonths;
      totalPayment.value = monthlyPayment.value * tenorMonths + downPayment;
    }
  } catch (error) {
    console.error('Calculation failed:', error);
    monthlyPayment.value = 0;
    totalPayment.value = 0;
    calculationResult.value = null;
  } finally {
    isCalculating.value = false;
  }
};

// Computed property for form validation
const canCalculate = computed(() => {
  if (!activeCategory.value || !selectedTenor.value) return false;
  
  if (activeCategory.value === 'Motor') {
    return selectedVehicle.value && selectedDp.value;
  } else {
    return priceInput.value && dpInput.value;
  }
});

// Watch for changes to trigger recalculation
watch([selectedVehicle, selectedDp, selectedTenor], () => {
  if (activeCategory.value === 'Motor') {
    calculateSimulation();
  }
});

watch([priceInput, dpInput, selectedTenor], () => {
  if (activeCategory.value !== 'Motor') {
    calculateSimulation();
  }
});

</script>

<template>
  <div>
    <Jumbotron
      label="Services"
      img="/img/dummy1.jpg"
      desc="Temukan layanan terbaik untuk kebutuhan finansial Anda"
    />
    
    <!-- Loading State -->
    <div v-if="isLoading" class="xl:px-15 px-3 py-8 xl:py-12">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div class="h-64 bg-gray-200 rounded mb-6"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <ErrorAlert 
      v-else-if="error" 
      :error="error"
      :title="t('error.loadDataFailed')"
      :message="t('error.serviceDetailLoadError')"
      @retry="retryFetch"
      class="xl:px-15 px-3 py-8 xl:py-12"
    />
    
    <!-- Content State -->
    <div v-else-if="serviceItem" class="relative">
      <div class="xl:px-15 px-3 py-8 xl:py-12 relative">
        <h1 class="xl:text-5xl text-2xl font-bold mb-6 text-center">
        {{ getLocalizedTitle(serviceItem) }}
      </h1>
      <!-- Short Description (Excerpt) -->
      <div v-if="getLocalizedExcerpt(serviceItem)" class="mb-8 text-xl text-gray-700 leading-relaxed">
        <div v-html="getLocalizedExcerpt(serviceItem)" />
      </div>
      
      <!-- Separator -->
      <hr class="my-8 border-t border-gray-200">
      
      <!-- Full Content -->
      <div class="prose prose-lg max-w-none">
        <div v-if="getLocalizedContent(serviceItem)" v-html="getLocalizedContent(serviceItem)" />
        <p v-else class="text-gray-500">No detailed content available</p>
      </div>
        
        <!-- Service Details -->
        <div v-if="accordionItems.length" class="mt-12">
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem
              v-for="item in accordionItems"
              :key="item.value"
              :value="item.value"
            >
              <AccordionTrigger class="xl:text-2xl text-lg">{{
                item.title
              }}</AccordionTrigger>
              <AccordionContent class="xl:text-xl text-base">
                <div v-html="item.content"></div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <!-- Service meta information -->
        <div v-if="serviceItem.author || serviceItem.source_url" class="mt-8 pt-6 border-t border-gray-200">
          <div v-if="serviceItem.author" class="mb-2">
            <span class="font-medium">Author:</span> {{ serviceItem.author }}
          </div>
          <div v-if="serviceItem.source_url">
            <span class="font-medium">Source:</span>
            <a :href="serviceItem.source_url" target="_blank" rel="noopener noreferrer" class="text-red-100 hover:underline">
              {{ serviceItem.source_url }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Back button (desktop) -->
      <NuxtLink to="/service" class="hidden xl:block">
        <Icon name="mdi:chevron-left" class="size-8 absolute top-12 left-0 hover:text-red-100" />
      </NuxtLink>
    </div>
    
    <!-- Credit Simulation Section - only for pembiayaan-serbaguna -->
    <div v-if="serviceItem && serviceItem.slug === 'pembiayaan-serbaguna'" 
         class="relative px-3 xl:px-15 py-8 xl:py-12 bg-red-100 overflow-hidden">
      <img
        src="/img/dummy1.jpg"
        alt="Credit Simulation"
        class="absolute inset-0 w-full h-full object-cover opacity-70 object-center"
      />
      <div class="absolute inset-0 bg-red-100/65 mix-blend-multiply"></div>
      <h1 class="relative z-10 text-white xl:text-5xl text-2xl font-bold text-center mb-12">
        Credit Simulation
      </h1>
      <div class="grid grid-cols-1 xl:grid-cols-2 z-10 relative gap-6 xl:gap-12">
        <div class="bg-white/20 rounded-2xl p-6">
          <h6 class="mb-5 text-lg xl:text-2xl text-white font-bold text-center">
            Pilih Kategori
          </h6>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              v-for="(item, index) in creditCategories.slice(0, 3)"
              :key="index"
              @click="toggleCategory(item.label)"
              :class="[
                'flex flex-col gap-6 items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-300',
                activeCategory === item.label
                  ? 'bg-white/100'
                  : 'bg-white/70 hover:bg-white/100',
              ]"
            >
              <img
                :src="item.img"
                :alt="item.label"
                class="size-25 object-contain object-center"
              />
              <p class="text-red-100 text-center font-bold">{{ item.label }}</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <div
              v-for="(item, index) in creditCategories.slice(3)"
              :key="index"
              @click="toggleCategory(item.label)"
              :class="[
                'flex flex-col gap-6 items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-300',
                activeCategory === item.label
                  ? 'bg-white/100'
                  : 'bg-white/70 hover:bg-white/100',
              ]"
            >
              <img
                :src="item.img"
                :alt="item.label"
                class="size-25 object-contain object-center"
              />
              <p class="text-red-100 text-center font-bold">{{ item.label }}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Harga Barang
            </h6>
            <input v-model="priceInput" type="number" placeholder="Rp20.000.000" 
                   class="h-10 bg-white rounded-lg border border-divider px-3 text-divider" />
          </div>
          <div v-if="activeCategory === 'Motor'" class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Pilih Jenis Kendaraan
            </h6>
            <select v-model="selectedVehicle" class="h-10 bg-white rounded-lg border border-divider px-3 text-divider">
              <option value="">
                {{ motorApi.isLoading ? 'Memuat data motor...' : 'Pilih Kendaraan' }}
              </option>
              <option v-for="vehicle in vehicleOptions" :key="vehicle.id" :value="vehicle">
                {{ vehicle.name }} - {{ formatCurrency(vehicle.price) }} ({{ vehicle.area }})
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Total Uang Muka
            </h6>
            <select v-if="activeCategory === 'Motor'" v-model="selectedDp" 
                    class="h-10 bg-white rounded-lg border border-divider px-3 text-divider"
                    :disabled="!selectedVehicle">
              <option value="">
                {{ !selectedVehicle ? 'Pilih kendaraan terlebih dahulu' : 'Pilih Uang Muka' }}
              </option>
              <option v-for="dp in dpOptions" :key="dp.dp_amount" :value="dp">
                {{ dp.label }}
              </option>
            </select>
            <input v-else v-model="dpInput" type="number" placeholder="Rp10.000.000" 
                   class="h-10 bg-white rounded-lg border border-divider px-3 text-divider" />
          </div>

          <div class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Pilih Tenor
            </h6>
            <div class="flex flex-wrap sm:flex-nowrap items-center gap-4">
              <div
                v-for="option in (activeCategory === 'Motor' ? tenorOptions : [6, 12, 18, 24])"
                :key="option"
                @click="toggleTenor(option)"
                :class="[
                  'rounded-xl py-3 w-full text-center text-lg cursor-pointer transition-all duration-300',
                  selectedTenor === option
                    ? 'bg-red-50 text-black-100'
                    : 'bg-red-100 text-white hover:bg-red-50 hover:text-black-100',
                ]"
              >
                {{ option }} Bulan
              </div>
            </div>
          </div>
          <button
            @click="calculateSimulation"
            :disabled="isCalculating || !canCalculate"
            class="py-3 bg-white font-bold text-xl xl:text-2xl text-red-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isCalculating">Menghitung...</span>
            <span v-else>Hitung Sekarang</span>
          </button>
          <div class="bg-white/20 p-6 rounded-2xl">
            <h6 class="font-bold text-2xl text-white mb-6 text-center">
              Estimasi Angsuran
            </h6>
            <h3 class="text-center text-white xl:text-5xl text-2xl font-bold mb-3">
              <span v-if="motorApi.error && activeCategory === 'Motor'" class="text-red-300">
                Error perhitungan
              </span>
              <span v-else>
                {{ formatCurrency(monthlyPayment) }}/Bulan
              </span>
            </h3>
            <p class="text-center text-white text-lg mb-4">
              Total yang dibayarkan {{ formatCurrency(totalPayment) }}
            </p>
            
            <!-- Additional details for Motor calculation -->
            <div v-if="activeCategory === 'Motor' && calculationResult" class="mb-6 text-white text-sm space-y-2">
              <div class="flex justify-between">
                <span>Harga Motor:</span>
                <span>{{ formatCurrency(parseFloat(calculationResult.calculation.motor_price)) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Uang Muka ({{ calculationResult.calculation.dp_percent }}%):</span>
                <span>{{ formatCurrency(calculationResult.calculation.dp_amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tenor:</span>
                <span>{{ calculationResult.calculation.tenor_months }} Bulan</span>
              </div>
              <div class="flex justify-between">
                <span>Total Bunga:</span>
                <span>{{ formatCurrency(calculationResult.calculation.total_interest) }}</span>
              </div>
              <div class="border-t border-white/30 pt-2">
                <div class="flex justify-between font-semibold">
                  <span>Angsuran per Bulan:</span>
                  <span>{{ formatCurrency(calculationResult.calculation.monthly_installment) }}</span>
                </div>
              </div>
            </div>
            
            <p class="text-xs text-white">
              <span v-if="activeCategory === 'Motor'">
                *Perhitungan berdasarkan data motor terbaru dan dapat berubah sewaktu-waktu
              </span>
              <span v-else>
                *Biaya tambahan administrasi 2% pada pembayaran pertama
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: inherit;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: inherit;
}

.prose a {
  color: #dc2626;
  text-decoration: none;
}

.prose a:hover {
  text-decoration: underline;
}
</style>