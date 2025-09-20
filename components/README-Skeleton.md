# Skeleton Loading Components

Kumpulan komponen skeleton loading yang dapat digunakan untuk memberikan feedback visual saat data sedang dimuat.

## Komponen yang Tersedia

### 1. SkeletonLoader (Base Component)
Komponen dasar untuk membuat skeleton loading dengan animasi shimmer.

```vue
<SkeletonLoader 
  width="100%" 
  height="20px" 
  customClass="mb-3 rounded-lg" 
/>
```

**Props:**
- `width`: Lebar skeleton (default: "100%")
- `height`: Tinggi skeleton (default: "20px") 
- `customClass`: CSS class tambahan (default: "")

### 2. AboutPageSkeleton
Skeleton loading khusus untuk halaman About Us.

```vue
<AboutPageSkeleton v-if="isLoading" />
```

**Fitur:**
- Navigation anchor skeleton
- Our story section skeleton
- Vision & mission skeleton
- F.A.S.T & I.D.C values skeleton
- Logo philosophy skeleton  
- Management profiles skeleton

### 3. HomePageSkeleton
Skeleton loading khusus untuk halaman Homepage.

```vue
<HomePageSkeleton v-if="isLoading" />
```

**Fitur:**
- Hero/gallery section skeleton
- Navigation buttons skeleton
- Six reasons section skeleton
- Services section skeleton
- Application process skeleton
- Partners section skeleton
- News updates skeleton
- FAQ section skeleton

### 4. GenericPageSkeleton
Komponen skeleton yang fleksibel untuk berbagai jenis halaman.

```vue
<GenericPageSkeleton 
  :sections="['hero', 'grid', 'article']"
  :gridItems="6"
  gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
  :listItems="5"
/>
```

**Props:**
- `sections`: Array section yang ingin ditampilkan
- `gridItems`: Jumlah item dalam grid (default: 6)
- `gridCols`: CSS classes untuk grid layout (default: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3")
- `listItems`: Jumlah item dalam list (default: 5)
- `tableRows`: Jumlah row dalam table (default: 8)
- `navItems`: Jumlah item navigasi (default: 5)

**Available Sections:**
- `hero`: Hero section dengan title dan description
- `navigation`: Navigation buttons
- `grid`: Grid layout dengan cards
- `article`: Article/content dengan paragraphs
- `two-column`: Layout dua kolom
- `list`: List dengan icons dan descriptions
- `table`: Table layout
- `cta`: Call-to-action section

### 5. NewsPageSkeleton
Skeleton loading khusus untuk halaman News/Blog.

```vue
<NewsPageSkeleton v-if="isLoading" />
```

**Fitur:**
- Page title skeleton
- Filter/category navigation skeleton
- News grid skeleton dengan cards
- Pagination skeleton

### 6. ServicePageSkeleton  
Skeleton loading khusus untuk halaman Services.

```vue
<ServicePageSkeleton v-if="isLoading" />
```

**Fitur:**
- Page header skeleton
- Service categories navigation skeleton
- Service cards skeleton
- Process steps skeleton
- FAQ section skeleton
- Contact CTA skeleton

### 7. ContactPageSkeleton
Skeleton loading khusus untuk halaman Contact Us.

```vue
<ContactPageSkeleton v-if="isLoading" />
```

**Fitur:**
- Office info section skeleton
- Contact header with image and title skeleton
- Service cards grid skeleton
- FAQ accordion section skeleton

## Cara Implementasi

### 1. Setup Loading State
```vue
<script setup>
const isLoading = ref(true);

onMounted(() => {
  // Simulasi loading data
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});
</script>
```

### 2. Implementasi di Template
```vue
<template>
  <div>
    <!-- Loading State -->
    <AboutPageSkeleton v-if="isLoading" />
    
    <!-- Content State -->
    <div v-else>
      <!-- Konten actual page -->
    </div>
  </div>
</template>
```

### 3. Customisasi dengan GenericPageSkeleton
```vue
<template>
  <div>
    <!-- Loading State untuk halaman custom -->
    <GenericPageSkeleton 
      v-if="isLoading"
      :sections="['hero', 'two-column', 'grid', 'cta']"
      :gridItems="9"
      gridCols="grid-cols-1 md:grid-cols-3"
    />
    
    <!-- Content State -->
    <div v-else>
      <!-- Konten actual page -->
    </div>
  </div>
</template>
```

## Best Practices

1. **Gunakan skeleton yang sesuai dengan layout**: Pilih skeleton component yang paling mendekati layout actual page
2. **Atur timing yang realistis**: Jangan terlalu cepat atau terlalu lambat (1-3 detik optimal)
3. **Konsisten dengan design system**: Pastikan skeleton menggunakan warna dan spacing yang konsisten
4. **Responsive design**: Skeleton harus responsive seperti konten aslinya
5. **Gunakan untuk UX yang lebih baik**: Skeleton memberikan feedback bahwa aplikasi sedang bekerja

## Contoh Penggunaan di Page Lain

### News Page
```vue
<script setup>
const isLoading = ref(true);
const news = ref([]);

onMounted(async () => {
  try {
    news.value = await $fetch('/api/news');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <NewsPageSkeleton v-if="isLoading" />
    <div v-else>
      <!-- News content -->
    </div>
  </div>
</template>
```

### Service Page
```vue
<script setup>
const isLoading = ref(true);
const services = ref([]);

onMounted(async () => {
  try {
    services.value = await $fetch('/api/services');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <ServicePageSkeleton v-if="isLoading" />
    <div v-else>
      <!-- Services content -->
    </div>
  </div>
</template>
```

### Contact Page
```vue
<script setup>
const isLoading = ref(true);
const contactInfo = ref({});

onMounted(async () => {
  try {
    contactInfo.value = await $fetch('/api/contact');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <Jumbotron label="Hubungi Kami" img="/img/dummy1.jpg" />
    <ContactPageSkeleton v-if="isLoading" />
    <div v-else>
      <!-- Contact content -->
    </div>
  </div>
</template>
```