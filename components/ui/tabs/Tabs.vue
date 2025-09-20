<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { TabsRoot, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  TabsRootProps & {
    class?: HTMLAttributes["class"];
    orientation?: "horizontal" | "vertical";
  }
>();
const emits = defineEmits<TabsRootEmits>();

const delegatedProps = reactiveOmit(props, "class", "orientation");
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const orientation = computed(() => props.orientation ?? "horizontal");
</script>

<template>
  <TabsRoot
    data-slot="tabs"
    v-bind="forwarded"
    :class="
      cn(
        orientation === 'vertical'
          ? 'flex flex-col xl:flex-row gap-6 xl:gap-12'
          : 'flex flex-col gap-2',
        props.class
      )
    "
  >
    <slot />
  </TabsRoot>
</template>
