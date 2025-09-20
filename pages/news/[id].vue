<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError } from "h3";

const news = [
  {
    id: "detail-news-1",
    img: "/img/dummy1.jpg",
    date: "11 Januari 2024",
    category: "Kegiatan Perusahaan",
    title: "Lorem Ipsum Dolor Sit Amet",
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis viverra neque pretium sodales. Vestibulum mollis justo nec ante condimentum, quis pretium ante blandit. Nam maximus tincidunt justo a mollis. Duis sit amet iaculis lacus. In hac habitasse platea dictumst. Sed condimentum aliquam placerat. Suspendisse et pharetra metus. Sed pellentesque ullamcorper faucibus. Quisque eget nisl egestas, vulputate augue non, venenatis nibh. Maecenas odio libero, pretium at metus id, condimentum placerat lectus. <br /> <br /> Vestibulum egestas pellentesque dolor, in convallis purus consequat sit amet. Sed sagittis dolor posuere gravida mattis. Quisque blandit commodo semper. Donec egestas ligula felis, sit amet hendrerit ipsum maximus id. Nulla at nisl ac magna consequat sodales. Nam sed interdum risus. Mauris eu augue maximus, euismod lorem et, accumsan ex. Suspendisse lacinia libero ac sapien rutrum tincidunt. <br /> <br /> Donec vulputate velit eros, sit amet rhoncus neque malesuada sit amet. Nunc vestibulum eros nisi, eu vestibulum augue scelerisque ut. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In id feugiat magna, ac dictum ipsum. Cras id commodo sem, quis condimentum sapien. Integer interdum erat erat, consectetur dignissim est dapibus ac. Vivamus accumsan, purus eget placerat vehicula, libero risus volutpat diam, sed porta lacus turpis id quam. Suspendisse potenti. Sed nulla neque, blandit at sapien sed, sollicitudin elementum magna. Vestibulum maximus, nisl at vestibulum lobortis, lorem enim porttitor nibh, sed pharetra eros ante et tellus. Etiam elit ipsum, eleifend in elit at, malesuada ullamcorper odio. Nulla non sagittis odio, sit amet elementum justo. Mauris felis nunc, porttitor ullamcorper velit et, ultricies aliquam eros. Nulla sit amet tempor nibh.`,
  },
  {
    id: "detail-news-2",
    img: "/img/dummy2.jpg",
    date: "12 Februari 2024",
    category: "Siaran Pers",
    title: "Lorem Ipsum Dolor Sit Amet",
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis viverra neque pretium sodales. Vestibulum mollis justo nec ante condimentum, quis pretium ante blandit. Nam maximus tincidunt justo a mollis. Duis sit amet iaculis lacus. In hac habitasse platea dictumst. Sed condimentum aliquam placerat. Suspendisse et pharetra metus. Sed pellentesque ullamcorper faucibus. Quisque eget nisl egestas, vulputate augue non, venenatis nibh. Maecenas odio libero, pretium at metus id, condimentum placerat lectus. <br /> <br /> Vestibulum egestas pellentesque dolor, in convallis purus consequat sit amet. Sed sagittis dolor posuere gravida mattis. Quisque blandit commodo semper. Donec egestas ligula felis, sit amet hendrerit ipsum maximus id. Nulla at nisl ac magna consequat sodales. Nam sed interdum risus. Mauris eu augue maximus, euismod lorem et, accumsan ex. Suspendisse lacinia libero ac sapien rutrum tincidunt. <br /> <br /> Donec vulputate velit eros, sit amet rhoncus neque malesuada sit amet. Nunc vestibulum eros nisi, eu vestibulum augue scelerisque ut. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In id feugiat magna, ac dictum ipsum. Cras id commodo sem, quis condimentum sapien. Integer interdum erat erat, consectetur dignissim est dapibus ac. Vivamus accumsan, purus eget placerat vehicula, libero risus volutpat diam, sed porta lacus turpis id quam. Suspendisse potenti. Sed nulla neque, blandit at sapien sed, sollicitudin elementum magna. Vestibulum maximus, nisl at vestibulum lobortis, lorem enim porttitor nibh, sed pharetra eros ante et tellus. Etiam elit ipsum, eleifend in elit at, malesuada ullamcorper odio. Nulla non sagittis odio, sit amet elementum justo. Mauris felis nunc, porttitor ullamcorper velit et, ultricies aliquam eros. Nulla sit amet tempor nibh.`,
  },
  {
    id: "detail-news-3",
    img: "/img/dummy3.jpg",
    date: "13 Maret 2024",
    category: "Bisnis",
    title: "Lorem Ipsum Dolor Sit Amet",
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis viverra neque pretium sodales. Vestibulum mollis justo nec ante condimentum, quis pretium ante blandit. Nam maximus tincidunt justo a mollis. Duis sit amet iaculis lacus. In hac habitasse platea dictumst. Sed condimentum aliquam placerat. Suspendisse et pharetra metus. Sed pellentesque ullamcorper faucibus. Quisque eget nisl egestas, vulputate augue non, venenatis nibh. Maecenas odio libero, pretium at metus id, condimentum placerat lectus. <br /> <br /> Vestibulum egestas pellentesque dolor, in convallis purus consequat sit amet. Sed sagittis dolor posuere gravida mattis. Quisque blandit commodo semper. Donec egestas ligula felis, sit amet hendrerit ipsum maximus id. Nulla at nisl ac magna consequat sodales. Nam sed interdum risus. Mauris eu augue maximus, euismod lorem et, accumsan ex. Suspendisse lacinia libero ac sapien rutrum tincidunt. <br /> <br /> Donec vulputate velit eros, sit amet rhoncus neque malesuada sit amet. Nunc vestibulum eros nisi, eu vestibulum augue scelerisque ut. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In id feugiat magna, ac dictum ipsum. Cras id commodo sem, quis condimentum sapien. Integer interdum erat erat, consectetur dignissim est dapibus ac. Vivamus accumsan, purus eget placerat vehicula, libero risus volutpat diam, sed porta lacus turpis id quam. Suspendisse potenti. Sed nulla neque, blandit at sapien sed, sollicitudin elementum magna. Vestibulum maximus, nisl at vestibulum lobortis, lorem enim porttitor nibh, sed pharetra eros ante et tellus. Etiam elit ipsum, eleifend in elit at, malesuada ullamcorper odio. Nulla non sagittis odio, sit amet elementum justo. Mauris felis nunc, porttitor ullamcorper velit et, ultricies aliquam eros. Nulla sit amet tempor nibh.`,
  },
];

const route = useRoute();
const newsEvent = news.find((s) => s.id === route.params.id);

if (!newsEvent) {
  throw createError({
    statusCode: 404,
    statusMessage: "News not found",
  });
}
</script>

<template>
  <div>
    <Jumbotron
      label="News & Event"
      img="/img/dummy1.jpg"
      desc="Temukan berita terbaru mengenai TEZ Capital di sini"
    />
    <div class="relative">
      <div class="xl:px-15 px-3 py-8 xl:py-12 relative">
        <NuxtLink
          to="/news"
          class="flex items-center gap-1 text-base text-red-100 mb-6 xl:hidden"
        >
          <Icon name="mdi:chevron-left" class="size-4" />
          Back to News & Event
        </NuxtLink>
        <p class="xl:text-xl text-base text-divider mb-1 xl:mb-6">
          {{ newsEvent.date }} | {{ newsEvent.category }}
        </p>
        <div class="flex flex-wrap gap-4 justify-between">
          <h1 class="xl:text-5xl text-2xl text-black-100">
            {{ newsEvent.title }}
          </h1>
          <div class="flex items-center gap-4">
            <Icon
              name="mdi:link-variant"
              class="text-black-50 size-4 xl:size-6"
            />
            <Icon name="mdi:facebook" class="text-black-50 size-4 xl:size-6" />
            <Icon name="mdi:twitter" class="text-black-50 size-4 xl:size-6" />
            <Icon name="mdi:whatsapp" class="text-black-50 size-4 xl:size-6" />
          </div>
        </div>
        <img
          src="/img/dummy1.jpg"
          :alt="newsEvent.title"
          class="xl:h-125 h-75 w-full object-cover object-center my-6 xl:my-12"
        />
        <p class="text-base xl:text-xl" v-html="newsEvent.desc" />
      </div>
      <NuxtLink to="/news" class="hidden xl:block">
        <Icon name="mdi:chevron-left" class="size-8 absolute top-12 left-0" />
      </NuxtLink>
    </div>
  </div>
</template>
