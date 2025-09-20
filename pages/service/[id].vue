<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError } from "h3";
import { ref } from "vue";

const services = [
  {
    id: "investment-financing",
    img: "img/services/1.png",
    title: "Investment Financing",
    description:
      "Pembiayaan multi guna adalah pembiayaan untuk pengadaan barang dan / atau jasa yang diperlukan untuk pemakaian / konsumsi dan bukan untuk keperluan usaha (aktivitas produktif).",
  },
  {
    id: "working-capital-financing",
    img: "img/services/2.png",
    title: "Working Capital Financing",
    description:
      "Pembiayaan Modal kerja adalah pembiayaan untuk memenuhi kebutuhan pengeluaran - pengeluaran aktivitas usaha dan merupakan pembiayaan dengan jangka waktu 3 bulan - 2 tahun.",
  },
  {
    id: "multi-purpose-financing",
    img: "img/services/3.png",
    title: "Multi-Purpose Financing",
    description:
      "Pembiayaan multi guna adalah pembiayaan untuk pengadaan barang dan / atau jasa yang diperlukan untuk pemakaian / konsumsi dan bukan untuk keperluan usaha (aktivitas produktif).",
  },
];

const accordionItems = [
  {
    value: "item-1",
    title: "Interest & Fees",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
  },
  {
    value: "item-2",
    title: "Document List",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare, tellus at laoreet faucibus, dolor massa dignissim justo, facilisis pretium dolor augue non diam.",
  },
];

const creditSimulation = [
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
];
const activeCategory = ref<string | null>(null);
function toggleCategory(label: string) {
  if (activeCategory.value === label) {
    activeCategory.value = null;
  } else {
    activeCategory.value = label;
  }
}

const route = useRoute();
const service = services.find((s) => s.id === route.params.id);

if (!service) {
  throw createError({
    statusCode: 404,
    statusMessage: "Service not found",
  });
}

const active = ref<string | null>(null);
const options = ["6 Bulan", "12 Bulan", "18 Bulan", "24 Bulan"];
function toggleOption(option: string) {
  if (active.value === option) {
    active.value = null;
  } else {
    active.value = option;
  }
}

const chooseVehicle = [
  { value: "soul", label: "Mio Soul" },
  { value: "nmax", label: "N-Max" },
  { value: "xmax", label: "X-Max" },
  { value: "aerox", label: "Aerox" },
  { value: "lexi", label: "Lexi" },
];

const chooseDp = [
  { value: "2000000", label: "Rp 2.000.000" },
  { value: "2500000", label: "Rp 2.500.000" },
  { value: "3000000", label: "Rp 3.000.000" },
  { value: "3500000", label: "Rp 3.500.000" },
  { value: "4000000", label: "Rp 4.000.000" },
  { value: "4500000", label: "Rp 4.500.000" },
  { value: "5000000", label: "Rp 5.000.000" },
];

const valueVehicle = ref<(typeof chooseVehicle)[0]>();
const valueDp = ref<(typeof chooseDp)[0]>();
</script>

<template>
  <div>
    <Jumbotron label="Our Services" img="/img/dummy1.jpg" />
    <div class="px-3 xl:px-15 py-8 xl:py-12 relative">
      <h1 class="xl:text-5xl text-2xl font-bold mb-6 text-center">
        {{ service.title }}
      </h1>
      <p class="text-center text-base xl:text-xl">{{ service.description }}</p>
      <div class="py-8 xl:py-12">
        <div class="bg-divider h-0.25 w-full"></div>
      </div>
      <h6 class="xl:text-4xl text-xl text-center mb-4">Persyaratan</h6>
      <ul class="list-disc text-base xl:text-xl ps-5">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>
          Morbi tristique quam ante, eget tempus nunc rhoncus in. Etiam diam
          felis, rutrum ut sem id, sagittis vehicula nisi.
        </li>
        <li>
          Cras viverra rutrum nibh non semper. Nulla viverra justo id venenatis
          interdum. Sed dui est, varius ac turpis in, fringilla facilisis sem.
          Nulla euismod elit et vestibulum dapibus. Curabitur pellentesque quis
          diam quis ultrices.
        </li>
        <li>
          Maecenas nec lacinia dolor. Nam commodo sapien metus, aliquet volutpat
          sem vehicula vel.
        </li>
        <li>
          Mauris non quam venenatis, ullamcorper tortor ut, posuere ex. Morbi
          ante nulla, dignissim vitae pharetra et, dignissim hendrerit nibh.
          Integer convallis vel orci in egestas.
        </li>
      </ul>
      <Accordion
        v-if="service && service.id !== 'multi-purpose-financing'"
        type="single"
        class="w-full mt-6 xl:mt-12"
        collapsible
      >
        <AccordionItem
          v-for="item in accordionItems"
          :key="item.value"
          :value="item.value"
        >
          <AccordionTrigger>{{ item.title }}</AccordionTrigger>
          <AccordionContent>
            {{ item.content }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <NuxtLink to="/service">
        <Icon
          name="mdi:chevron-left"
          class="size-6 xl:size-8 absolute top-8 xl:top-12 left-3 xl:left-15"
        />
      </NuxtLink>
    </div>
    <div
      v-if="service && service.id == 'multi-purpose-financing'"
      class="relative px-3 xl:px-15 py-8 xl:py-12 bg-red-100 overflow-hidden"
    >
      <img
        src="/img/dummy1.jpg"
        alt="Credit Simulation"
        class="absolute inset-0 w-full h-full object-cover opacity-70 object-center"
      />
      <div class="absolute inset-0 bg-red-100/65 mix-blend-multiply"></div>
      <h1
        class="relative z-10 text-white xl:text-5xl text-2xl font-bold text-center mb-12"
      >
        Credit Simulation
      </h1>
      <div
        class="grid grid-cols-1 xl:grid-cols-2 z-10 relative gap-6 xl:gap-12"
      >
        <div class="bg-white/20 rounded-2xl p-6">
          <h6 class="mb-5 text-lg xl:text-2xl text-white font-bold text-center">
            Pilih Kategori
          </h6>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              v-for="(i, index) in creditSimulation.slice(0, 3)"
              :key="index"
              @click="toggleCategory(i.label)"
              :class="[
                'flex flex-col gap-6 items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-300',
                activeCategory === i.label
                  ? 'bg-white/100'
                  : 'bg-white/70 hover:bg-white/100',
              ]"
            >
              <img
                :src="i.img"
                :alt="i.label"
                class="size-25 object-contain object-center"
              />
              <p class="text-red-100 text-center font-bold">{{ i.label }}</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <div
              v-for="(i, index) in creditSimulation.slice(3)"
              :key="index"
              @click="toggleCategory(i.label)"
              :class="[
                'flex flex-col gap-6 items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-300',
                activeCategory === i.label
                  ? 'bg-white/100'
                  : 'bg-white/70 hover:bg-white/100',
              ]"
            >
              <img
                :src="i.img"
                :alt="i.label"
                class="size-25 object-contain object-center"
              />
              <p class="text-red-100 text-center font-bold">{{ i.label }}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Harga Barang
            </h6>
            <Input type="number" placeholder="Rp20.000.000" />
          </div>
          <div v-if="activeCategory === 'Motor'" class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Pilih Jenis Kendaraan
            </h6>
            <Combobox v-model="valueVehicle" by="label">
              <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                  <div
                    class="flex justify-between items-center h-10 bg-white rounded-lg border border-divider px-3 text-divider"
                  >
                    {{ valueVehicle?.label ?? "Pilih Kendaraan" }}

                    <Icon
                      name="mdi:chevron-down"
                      class="size-4 shrink-0 text-divider"
                    />
                  </div>
                </ComboboxTrigger>
              </ComboboxAnchor>

              <ComboboxList align="start">
                <div class="relative w-full items-center">
                  <ComboboxInput
                    class="pl-6 focus-visible:ring-0 border-0 border-b rounded-none h-10"
                    placeholder="Cari Kendaraan"
                  />
                  <span
                    class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                  >
                    <Icon
                      name="mdi:search"
                      class="size-4 text-muted-foreground"
                    />
                  </span>
                </div>

                <ComboboxEmpty>Kendaraan tidak ditemukan.</ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="i in chooseVehicle"
                    :key="i.value"
                    :value="i"
                  >
                    {{ i.label }}

                    <ComboboxItemIndicator>
                      <Icon name="mdi:check" class="ml-auto h-4 w-4" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
          </div>
          <div class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Total Uang Muka
            </h6>
            <Combobox
              v-if="activeCategory === 'Motor'"
              v-model="valueDp"
              by="label"
            >
              <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                  <div
                    class="flex justify-between items-center h-10 bg-white rounded-lg border border-divider px-3 text-divider"
                  >
                    {{ valueDp?.label ?? "Pilih Uang Muka" }}

                    <Icon
                      name="mdi:chevron-down"
                      class="size-4 shrink-0 text-divider"
                    />
                  </div>
                </ComboboxTrigger>
              </ComboboxAnchor>

              <ComboboxList align="start">
                <div class="relative w-full items-center">
                  <ComboboxInput
                    class="pl-6 focus-visible:ring-0 border-0 border-b rounded-none h-10"
                    placeholder="Cari DP"
                  />
                  <span
                    class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                  >
                    <Icon
                      name="mdi:search"
                      class="size-4 text-muted-foreground"
                    />
                  </span>
                </div>

                <ComboboxEmpty>DP tidak ditemukan.</ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem v-for="i in chooseDp" :key="i.value" :value="i">
                    {{ i.label }}

                    <ComboboxItemIndicator>
                      <Icon name="mdi:check" class="ml-auto h-4 w-4" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
            <Input v-else type="number" placeholder="Rp10.000.000" />
          </div>

          <div class="flex flex-col gap-3">
            <h6 class="text-center text-white font-bold text-xl xl:text-2xl">
              Pilih Tenor
            </h6>
            <div class="flex flex-wrap sm:flex-nowrap items-center gap-4">
              <div
                v-for="option in options"
                :key="option"
                @click="toggleOption(option)"
                :class="[
                  'rounded-xl py-3 w-full text-center text-lg cursor-pointer transition-all duration-300',
                  active === option
                    ? 'bg-red-50 text-black-100'
                    : 'bg-red-100 text-white hover:bg-red-50 hover:text-black-100',
                ]"
              >
                {{ option }}
              </div>
            </div>
          </div>
          <button
            class="py-3 bg-white font-bold text-xl xl:text-2xl text-red-100 rounded-xl cursor-pointer"
          >
            Hitung Sekarang
          </button>
          <div class="bg-white/20 p-6 rounded-2xl">
            <h6 class="font-bold text-2xl text-white mb-6 text-center">
              Estimasi Angsuran
            </h6>
            <h3
              class="text-center text-white xl:text-5xl text-2xl font-bold mb-3"
            >
              Rp1.666.567/Bulan
            </h3>
            <p class="text-center text-white text-lg mb-8">
              Total yang dibayarkan Rp10.000.000
            </p>
            <p class="text-xs text-white">
              *Biaya tambahan administrasi 2% pada pembayaran pertama
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
