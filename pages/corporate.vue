<script setup>
import { getLocalTimeZone, today } from "@internationalized/date";
import { ref } from "vue";
const value = ref(today(getLocalTimeZone()));
const gallery = [
  {
    id: "detail-news-1",
    img: "/img/dummy1.jpg",
    alt: "Gallery 1",
    date: "11 Januari 2024",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
  },
  {
    id: "detail-news-2",
    img: "/img/dummy2.jpg",
    alt: "Gallery 2",
    date: "12 Februari 2024",
    category: "Siaran Pers",
    title: "Lorem Ipsum Dolor Sit Amet",
  },
  {
    id: "detail-news-3",
    img: "/img/dummy3.jpg",
    alt: "Gallery 3",
    date: "13 Maret 2024",
    category: "Bisnis",
    title: "Lorem Ipsum Dolor Sit Amet",
  },
];

const article = [
  {
    date: "11 Januari 2024",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
    id: "detail-news-1",
  },
  {
    date: "12 Februari 2025",
    category: "Bisnis",
    title: "Lorem Ipsum Dolor Sit Amet, Consetetur Adipiscing Elit.",
    id: "detail-news-2",
  },
  {
    date: "13 Maret 2025",
    category: "Kegiatan Perusahaan",
    title:
      "Lorem Ipsum Dolor Sit Amet, Consetetur Adipiscing Elit. Lorem Ipsum Dolor Sit Amet, Consetetur Adipiscing Elit.",
    id: "detail-news-3",
  },
  {
    date: "11 Januari 2025",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
    id: "detail-news-1",
  },
];

const lapTahunan = [
  {
    year: "2024",
    desc: "Lorem Ipsum Dolor Sit",
    link: "#",
  },
  {
    year: "2023",
    desc: "Lorem Ipsum Dolor Sit Amet: Consectetur Adispicing Elit.",
    link: "#",
  },
  {
    year: "2022",
    desc: "Lorem Ipsum Dolor Sit",
    link: "#",
  },
  {
    year: "2021",
    desc: "Lorem Ipsum Dolor Sit",
    link: "#",
  },
  {
    year: "2020",
    desc: "Lorem Ipsum Dolor Sit",
    link: "#",
  },
  {
    year: "2019",
    desc: "Lorem Ipsum Dolor Sit",
    link: "#",
  },
];

const tabKeuangan = [
  {
    title: "Semua Kategori",
    value: "all-category",
    subKeuangan: [
      {
        year: "2025",
        month: "Agustus",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Juli",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Juni",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Mei",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "April",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "Maret",
        desc: "Laporan Keuangan Triwulan",
      },
    ],
  },
  {
    title: "Laporan Keuangan Bulanan",
    value: "bulanan",
    subKeuangan: [
      {
        year: "2025",
        month: "Agustus",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Juli",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Juni",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Mei",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "April",
        desc: "Laporan Keuangan Bulanan",
      },
      {
        year: "2025",
        month: "Maret",
        desc: "Laporan Keuangan Bulanan",
      },
    ],
  },
  {
    title: "Laporan Keuangan Triwulan",
    value: "triwulan",
    subKeuangan: [
      {
        year: "2025",
        month: "Agustus",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "Juli",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "Juni",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "Mei",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "April",
        desc: "Laporan Keuangan Triwulan",
      },
      {
        year: "2025",
        month: "Maret",
        desc: "Laporan Keuangan Triwulan",
      },
    ],
  },
];
</script>

<template>
  <div>
    <Jumbotron label="Corporate" img="/img/dummy1.jpg" />
    <Tabs default-value="lap-keuangan" class="w-full">
      <TabsList>
        <TabsTrigger value="lap-keuangan">Laporan Keuangan</TabsTrigger>
        <TabsTrigger value="lap-tahunan">Laporan Tahunan</TabsTrigger>
        <TabsTrigger value="lap-pengaduan">Laporan Pengaduan</TabsTrigger>
        <TabsTrigger value="announcement">Announcement</TabsTrigger>
      </TabsList>
      <TabsContent value="lap-keuangan" class="xl:py-12 xl:px-15 py-8 px-3">
        <div
          class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 mb-6 border-b border-b-divider"
        >
          <h1 class="font-bold xl:text-5xl text-2xl">Laporan Keuangan</h1>
          <div class="flex gap-4 h-fit items-center w-full md:w-1/2 lg:w-1/4">
            <div class="relative h-fit w-full items-center">
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                class="pl-8"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">Filter</p>
                </div>
              </PopoverTrigger>
              <PopoverContent class="p-0 border-0">
                <Calendar
                  v-model="value"
                  :weekday-format="'short'"
                  class="rounded-md border border-grey"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Tabs
          default-value="all-category"
          class="w-full"
          orientation="vertical"
        >
          <TabsList class="flex flex-col max-w-full xl:max-w-75 border-0 h-fit">
            <TabsTrigger
              v-for="tab in tabKeuangan"
              :key="tab.value"
              :value="tab.value"
              class="w-full justify-between px-0"
            >
              {{ tab.title }}
              <Icon name="mdi:chevron-right" class="size-6 text-red-100" />
            </TabsTrigger>
          </TabsList>
          <TabsContent
            v-for="tab in tabKeuangan"
            :key="tab.value"
            :value="tab.value"
          >
            <div class="flex flex-col gap-6">
              <NuxtLink
                v-for="(i, index) in tab.subKeuangan"
                :key="index"
                to="#"
                class="flex rounded-xl xl:rounded-3xl overflow-hidden shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)]"
              >
                <div
                  class="bg-red-100 px-6 xl:px-12 flex items-center justify-center"
                >
                  <Icon
                    name="mdi:folder-open-outline"
                    class="size-10 xl:size-12 text-white"
                  />
                </div>
                <div class="flex flex-col p-4 xl:p-6 gap-2 w-full">
                  <p class="text-base xl:text-xl text-divider">
                    {{ i.year }} | {{ i.month }}
                  </p>
                  <p class="text-xl xl:text-3xl">{{ i.desc }}</p>
                </div>
              </NuxtLink>
            </div>
          </TabsContent>
        </Tabs>
        <Pagination
          v-slot="{ page }"
          :items-per-page="10"
          :total="30"
          :default-page="1"
          class="mt-6"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis :index="4" />

            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </TabsContent>
      <TabsContent value="lap-tahunan" class="xl:py-12 xl:px-15 py-8 px-3">
        <div
          class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 mb-6 border-b border-b-divider"
        >
          <h1 class="font-bold xl:text-5xl text-2xl">Laporan Tahunan</h1>
          <div class="flex gap-4 h-fit items-center w-full md:w-1/2 lg:w-1/4">
            <div class="relative h-fit w-full items-center">
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                class="pl-8"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">Filter</p>
                </div>
              </PopoverTrigger>
              <PopoverContent class="p-0 border-0">
                <Calendar
                  v-model="value"
                  :weekday-format="'short'"
                  class="rounded-md border border-grey"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <NuxtLink
            v-for="(i, index) in lapTahunan"
            :key="index"
            :to="i.link"
            class="flex h-auto xl:h-50 rounded-xl xl:rounded-3xl overflow-hidden shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)]"
          >
            <div
              class="bg-red-100 px-6 xl:px-12 flex items-center justify-center"
            >
              <Icon
                name="mdi:folder-open-outline"
                class="size-10 xl:size-15 text-white"
              />
            </div>
            <div class="flex flex-col p-4 xl:p-6 gap-6 justify-between w-full">
              <div class="flex flex-col gap-3">
                <p class="xl:text-3xl text-xl">{{ i.year }}</p>
                <p
                  class="text-divider text-base xl:text-xl line-clamp-1 xl:line-clamp-2"
                >
                  {{ i.desc }}
                </p>
              </div>
              <p class="text-red-100 text-base">Lihat Laporan</p>
            </div>
          </NuxtLink>
        </div>
        <Pagination
          v-slot="{ page }"
          :items-per-page="10"
          :total="30"
          :default-page="1"
          class="mt-6"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis :index="4" />

            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </TabsContent>
      <TabsContent value="lap-pengaduan" class="xl:py-12 xl:px-15 py-8 px-3">
        <h1
          class="font-bold xl:text-5xl text-2xl pb-6 mb-6 border-b border-b-divider"
        >
          Laporan Pengaduan
        </h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label for="name">Nama</label>
            <Input id="name" type="text" placeholder="Nama" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="judul">Judul</label>
            <Input id="judul" type="text" placeholder="Judul" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <Input id="email" type="email" placeholder="Email" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="telephone">Nomor Telepon</label>
            <Input id="telephone" type="number" placeholder="Nomor Telepon" />
          </div>
          <div class="flex flex-col gap-2 col-span-1 lg:col-span-2">
            <label for="commentar">Komentar</label>
            <Textarea id="commentar" placeholder="Komentar" />
          </div>
          <button
            class="py-3 px-12 bg-red-100 font-bold text-xl xl:text-2xl text-white rounded-full cursor-pointer lg:col-span-2 col-span-1 uppercase w-fit mx-auto"
            type="submit"
          >
            Kirim
          </button>
        </div>
      </TabsContent>
      <TabsContent value="announcement" class="xl:py-12 xl:px-15 py-8 px-3">
        <ClientOnly>
          <swiper-container
            :loop="true"
            :space-between="48"
            :pagination="{
              clickable: true,
            }"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            class="overflow-visible"
          >
            <swiper-slide
              v-for="i in gallery"
              :key="`slide-basic-${i.id}`"
              class="swiper-slide pb-12"
            >
              <NuxtLink :to="`/news/${i.id}`">
                <div
                  class="shadow-[0px_4px_19px_0px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden"
                >
                  <img
                    :src="i.img"
                    :alt="i.alt"
                    class="w-full h-75 object-cover"
                  />
                  <div class="gap-6 p-4 xl:p-6">
                    <p class="text-sm xl:text-xl text-divider mb-1 xl:mb-3">
                      {{ i.date }} | {{ i.category }}
                    </p>
                    <div class="flex justify-between items-center gap-3">
                      <p
                        class="xl:text-5xl text-xl text-black-100 line-clamp-1"
                      >
                        {{ i.title }}
                      </p>
                      <div class="flex items-center gap-2">
                        <p class="text-red-100 text-sm xl:text-xl">
                          Baca Artikel
                        </p>
                        <Icon
                          name="mdi:chevron-right"
                          class="xl:size-5 size-4 text-red-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
        <div class="flex justify-between flex-col lg:flex-row my-5 gap-6">
          <div class="flex flex-col gap-2 order-2 lg:order-1">
            <h1 class="font-bold text-xl lg:text-5xl">Hasil Pencarian</h1>
            <p class="text-base lg:text-2xl">
              5 hasil ditemukan dengan keyword <b>lorem</b>
            </p>
          </div>
          <div class="flex gap-4 h-fit items-center order-1 lg:order-2">
            <div class="relative h-fit w-full items-center">
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                class="pl-8"
              />
              <span class="absolute top-1/2 -translate-y-1/2 px-2">
                <Icon name="mdi:search" class="size-5" />
              </span>
            </div>
            <Popover>
              <PopoverTrigger>
                <div class="flex items-center gap-2 h-fit cursor-pointer">
                  <Icon name="mdi:filter-variant" class="size-5 text-red-100" />
                  <p class="text-red-100 font-medium">Filter</p>
                </div>
              </PopoverTrigger>
              <PopoverContent class="p-0 border-0">
                <Calendar
                  v-model="value"
                  :weekday-format="'short'"
                  class="rounded-md border border-grey"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <ul class="flex flex-col">
          <li v-for="(i, index) in article" :key="index">
            <NuxtLink
              :to="`/news/${i.id}`"
              class="flex justify-between items-end gap-6 py-5 border-b border-b-divider"
            >
              <div class="flex flex-col gap-1">
                <p class="text-divider text-sm xl:text-base">
                  {{ i.date }} | {{ i.category }}
                </p>
                <h4 class="xl:text-4xl text-xl line-clamp-1">{{ i.title }}</h4>
              </div>
              <div class="flex items-center gap-2 !min-w-fit">
                <p class="text-red-100 text-sm xl:text-xl">Baca Artikel</p>
                <Icon name="mdi:chevron-right" class="size-5 text-red-100" />
              </div>
            </NuxtLink>
          </li>
        </ul>
        <Pagination
          v-slot="{ page }"
          :items-per-page="10"
          :total="30"
          :default-page="1"
          class="mt-6"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>

            <PaginationEllipsis :index="4" />

            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </TabsContent>
    </Tabs>
  </div>
</template>
