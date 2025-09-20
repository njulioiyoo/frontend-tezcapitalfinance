<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { t, locale, setLocale } = useI18n();

const isMobileMenuOpen = ref(false);
const openAccordion = ref(null);

// Initialize language from localStorage
onMounted(() => {
  if (process.client) {
    // Clean up any old keys
    localStorage.removeItem('i18n_redirected');
    localStorage.removeItem('tez-lang');
    
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && savedLang !== locale.value) {
      setLocale(savedLang);
    } else if (!savedLang) {
      localStorage.setItem('app_language', 'id');
    }
  }
});

const toggleAccordion = (index) => {
  openAccordion.value = openAccordion.value === index ? null : index;
};

const menuHeader = computed(() => [
  {
    label: t('nav.aboutUs'),
    link: "/about",
    children: [
      {
        title: t('nav.aboutUs'),
        subMenu: [
          { label: t('nav.about.ourStory'), link: "/about" },
          { label: t('nav.about.logoPhilosophy'), link: "/about" },
        ],
      },
    ],
  },
  {
    label: t('nav.services'),
    link: "/service",
    children: [
      {
        title: t('nav.services'),
        subMenu: [
          { label: t('nav.service.serviceList'), link: "/service" },
          { label: t('nav.service.workingCapitalFinancing'), link: "/service" },
          { label: t('nav.service.investmentFinancing'), link: "/service" },
          { label: t('nav.service.multiPurposeFinancing'), link: "/service" },
        ],
      },
      {
        title: t('nav.relatedInformation'),
        subMenu: [
          { label: t('nav.service.faq'), link: "/service" },
        ],
      },
    ],
  },
  {
    label: t('nav.newsEvent'),
    link: "/news",
    children: [
      {
        title: t('nav.newsEvent'),
        subMenu: [
          { label: t('nav.news.bisnis'), link: "/news" },
          { label: t('nav.news.companyActivities'), link: "/news" },
          { label: t('nav.news.pressRelease'), link: "/news" },
          { label: t('nav.news.highlights'), link: "/news" },
        ],
      },
    ],
  },
  {
    label: t('nav.corporate'),
    link: "/corporate",
    children: [
      {
        title: t('nav.corporate'),
        subMenu: [
          { label: t('nav.corporateMenu.financialReport'), link: "/corporate" },
          { label: t('nav.corporateMenu.annualReport'), link: "/corporate" },
          { label: t('nav.corporateMenu.complaintReport'), link: "/corporate" },
          { label: t('nav.corporateMenu.announcement'), link: "/corporate" },
        ],
      },
    ],
  },
]);

const dataHome = computed(() => [
  {
    label: t('nav.homeMenu.reasonsToChoose'),
    link: "/",
  },
  {
    label: t('nav.homeMenu.ourServices'),
    link: "/",
  },
  {
    label: t('nav.homeMenu.applicationProcess'),
    link: "/",
  },
  {
    label: t('nav.homeMenu.newsUpdates'),
    link: "/",
  },
  {
    label: t('nav.service.faq'),
    link: "/",
  },
]);

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'id', name: 'ID' }
];

const setLang = async (langCode) => {
  await setLocale(langCode);
  if (process.client) {
    localStorage.setItem('app_language', langCode);
  }
};
</script>

<template>
  <div class="fixed bg-white w-full xl:max-w-360 z-50 top-0">
    <!-- TOP BAR -->
    <div class="flex justify-between items-center p-3 xl:hidden">
      <NuxtLink to="/">
        <img src="/img/logo.png" alt="TEZ" class="h-10 object-contain" />
      </NuxtLink>

      <div
        class="h-full font-medium cursor-pointer duration-300 bg-white flex gap-1 items-center"
      >
        <template v-for="(lang, index) in languages" :key="lang.code">
          <span
            :class="[
              'cursor-pointer transition-colors duration-200 select-none',
              locale === lang.code 
                ? 'text-red-100 font-bold' 
                : 'text-gray-600 hover:text-red-100'
            ]"
            @click.stop="setLang(lang.code)"
            style="z-index: 999; position: relative;"
          >
            {{ lang.name }}
          </span>
          <span v-if="index < languages.length - 1" class="text-gray-400">|</span>
        </template>
      </div>

      <button @click="isMobileMenuOpen = !isMobileMenuOpen">
        <Icon
          v-if="!isMobileMenuOpen"
          name="mdi:menu"
          class="w-7 h-7 text-black-100 cursor-pointer"
        />
        <Icon
          v-else
          name="mdi:close"
          class="w-7 h-7 text-black-100 cursor-pointer"
        />
      </button>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden xl:block">
      <div class="flex justify-between items-center px-4">
        <NuxtLink to="/">
          <img
            src="/img/logo.png"
            alt="TEZ Capital & Finance"
            class="h-18 object-contain"
          />
        </NuxtLink>
        <div class="flex items-center gap-3">
          <a class="flex items-center gap-2" href="tel:+2150666206">
            <div
              class="size-6 bg-divider flex items-center justify-center rounded-full p-1"
            >
              <Icon name="mdi:phone" class="text-white" />
            </div>
            <span class="text-xl font-medium">021-5066-6206</span>
          </a>
          <NuxtLink
            to="#"
            class="py-1 px-6 rounded-full bg-red-100 hover:bg-red-50 transition-all duration-300 font-bold text-xl text-white hover:text-red-100 flex items-center justify-center cursor-pointer"
            >{{ t('nav.applyNow') }}</NuxtLink
          >
          <NuxtLink
            to="#"
            class="py-1 px-6 rounded-full bg-white hover:bg-red-100 transition-all duration-300 font-medium text-xl text-red-100 hover:text-white flex items-center justify-center cursor-pointer border border-red-100"
            >{{ t('nav.joinUs') }}</NuxtLink
          >
        </div>
      </div>
      <div class="border-y border-y-grey">
        <ul
          class="relative flex w-fit items-center justify-center divide-x mx-auto divide-grey"
        >
          <li
            :class="[
              'transition-all duration-300 h-[-webkit-fill-available] group',
              route.path === '/' ? 'bg-red-50' : 'bg-white hover:bg-grey',
            ]"
          >
            <NuxtLink to="/" class="block py-2 px-10">
              <Icon name="mdi:home" class="size-5" />
            </NuxtLink>
            <ul
              class="absolute top-full left-0 right-0 bg-grey opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50 pt-3 p-6 grid gap-6 grid-cols-1"
            >
              <div>
                <span class="pb-2 border-b border-b-black block font-medium">
                  {{ t('nav.home') }}
                </span>
                <ul class="grid gap-3 pt-2 grid-cols-4">
                  <li
                    class="cursor-pointer"
                    v-for="(i, index) in dataHome"
                    :key="index"
                  >
                    <NuxtLink class="flex gap-1 items-center" :to="i.link">
                      <Icon name="mdi:chevron-right" />
                      <span class="block text-sm font-medium">
                        {{ i.label }}
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </ul>
          </li>
          <li
            v-for="(item, index) in menuHeader"
            :key="index"
            :class="[
              'group transition-all duration-300 h-full font-medium',
              route.path.startsWith(item.link)
                ? 'bg-red-50'
                : 'bg-white hover:bg-grey',
            ]"
          >
            <NuxtLink :to="item.link" class="py-2 px-10 block">
              {{ item.label }}
            </NuxtLink>
            <ul
              v-if="item.children"
              :class="[
                'absolute top-full left-0 right-0 bg-grey opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50 pt-3 p-6 grid gap-6',
                item.children.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
              ]"
            >
              <div v-for="(child, cIdx) in item.children" :key="cIdx">
                <span class="pb-2 border-b border-b-black block font-medium">
                  {{ child.title }}
                </span>
                <ul
                  class="grid gap-3 pt-2"
                  :class="
                    item.children.length > 1 ? 'grid-cols-2' : 'grid-cols-4'
                  "
                >
                  <li
                    v-for="(sub, sIdx) in child.subMenu"
                    :key="sIdx"
                    class="cursor-pointer"
                  >
                    <NuxtLink class="flex gap-1 items-center" :to="sub.link">
                      <Icon name="mdi:chevron-right" />
                      <span class="block text-sm font-medium">{{
                        sub.label
                      }}</span>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </ul>
          </li>
          <li
            :class="[
              'transition-all h-full font-medium cursor-pointer duration-300',
              route.path === '/contact'
                ? 'bg-red-50'
                : 'bg-white hover:bg-grey',
            ]"
          >
            <NuxtLink to="/contact" class="py-2 px-10 block"
              >{{ t('nav.contactUs') }}</NuxtLink
            >
          </li>
          <li
            class="transition-all h-full font-medium cursor-pointer duration-300 bg-white py-2 px-10 flex gap-2"
          >
            <template v-for="(lang, index) in languages" :key="lang.code">
              <span
                :class="[
                  'cursor-pointer transition-colors duration-200 select-none',
                  locale === lang.code 
                    ? 'text-red-100 font-bold' 
                    : 'text-gray-600 hover:text-red-100'
                ]"
                @click.stop="setLang(lang.code)"
                style="z-index: 999; position: relative;"
              >
                {{ lang.name }}
              </span>
              <span v-if="index < languages.length - 1" class="text-gray-400">|</span>
            </template>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="xl:hidden bg-white border-t border-t-grey"
    >
      <ul class="flex flex-col divide-y divide-gray-100 text-right">
        <li v-for="(item, index) in menuHeader" :key="index">
          <button
            class="w-full text-left p-3 flex justify-between items-center"
            @click="toggleAccordion(index)"
          >
            <Icon
              :name="
                openAccordion === index ? 'mdi:chevron-up' : 'mdi:chevron-down'
              "
              class="size-6"
            />
            <span>{{ item.label }}</span>
          </button>

          <!-- Accordion content -->
          <div v-if="openAccordion === index" class="px-3">
            <div
              v-for="(child, cIdx) in item.children"
              :key="cIdx"
              class="mb-2"
            >
              <ul class="space-y-3">
                <li v-for="(sub, sIdx) in child.subMenu" :key="sIdx">
                  <NuxtLink
                    :to="sub.link"
                    class="flex items-center justify-end gap-1 text-sm hover:text-red-500"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ sub.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </li>

        <li>
          <NuxtLink
            to="/contact"
            class="block px-4 py-3 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
            >{{ t('nav.contactUs') }}</NuxtLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>
