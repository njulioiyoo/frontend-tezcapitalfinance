import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "shadcn-nuxt", "nuxt-swiper", "@nuxtjs/i18n", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  },
  icon: {
    mode: "svg",
    serverBundle: {
      collections: ["mdi"],
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'id', file: 'id.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'id',
    detectBrowserLanguage: false,
    strategy: 'no_prefix'
  },
});
