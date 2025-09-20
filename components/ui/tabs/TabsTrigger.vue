<script setup lang="ts">
import type { TabsTriggerProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { TabsTrigger, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  TabsTriggerProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        `group relative inline-flex flex-1 items-center justify-center gap-1.5
         h-[calc(100%-1px)] p-6 cursor-pointer
         text-xl text-foreground whitespace-nowrap
         transition-[color,box-shadow]
         disabled:pointer-events-none disabled:opacity-50
         [&_svg]:pointer-events-none [&_svg]:shrink-0
         [&_svg:not([class*='size-'])]:size-4`,
        props.class
      )
    "
  >
    <slot />
    <div
      class="absolute bottom-0 left-0 w-full h-1 rounded-t-sm bg-red-100 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-300"
    ></div>
  </TabsTrigger>
</template>
