<template>
  <div class="relative" ref="selectContainer">
    <div
      @click="toggleDropdown"
      :class="[
        'h-10 bg-white rounded-lg border border-divider px-3 text-divider cursor-pointer flex items-center justify-between',
        disabled ? 'bg-gray-100 cursor-not-allowed' : '',
        isOpen ? 'border-red-100' : ''
      ]"
    >
      <span v-if="selectedOption" class="truncate">
        {{ selectedOption.label }}
      </span>
      <span v-else class="text-gray-400">
        {{ placeholder }}
      </span>
      <Icon 
        name="mdi:chevron-down" 
        :class="['w-4 h-4 transition-transform', isOpen ? 'rotate-180' : '']"
      />
    </div>
    
    <!-- Dropdown -->
    <div
      v-if="isOpen && !disabled"
      :class="[
        'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden',
        dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
      ]"
    >
      <!-- Search input -->
      <div class="p-2 border-b border-gray-200">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-100"
          @keydown.esc="closeDropdown"
          @keydown.enter.prevent="selectFirstOption"
          @keydown.up.prevent="navigateUp"
          @keydown.down.prevent="navigateDown"
        />
      </div>
      
      <!-- Options -->
      <div class="max-h-48 overflow-y-auto">
        <div
          v-if="filteredOptions.length === 0"
          class="px-3 py-2 text-sm text-gray-500 text-center"
        >
          {{ noResultsText }}
        </div>
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          :class="[
            'px-3 py-2 text-sm cursor-pointer transition-colors',
            index === highlightedIndex ? 'bg-red-50 text-red-100' : 'hover:bg-gray-50',
            selectedValue === option.value ? 'bg-red-100 text-white' : ''
          ]"
        >
          <div class="truncate font-medium">{{ option.label }}</div>
          <div v-if="option.subtitle" :class="[
            'text-xs truncate mt-1',
            selectedValue === option.value ? 'text-red-200' : 'text-gray-500'
          ]">
            {{ option.subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  subtitle?: string
}

interface Props {
  modelValue?: string | number | null
  options: Option[]
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option...',
  searchPlaceholder: 'Search...',
  noResultsText: 'No results found',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'change': [option: Option | null]
}>()

const selectContainer = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const dropdownPosition = ref<'up' | 'down'>('down')

// Computed properties
const selectedValue = computed(() => props.modelValue)

const selectedOption = computed(() => {
  if (!selectedValue.value) return null
  return props.options.find(option => option.value === selectedValue.value) || null
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query) ||
    (option.subtitle && option.subtitle.toLowerCase().includes(query))
  )
})

// Methods
const toggleDropdown = () => {
  if (props.disabled) return
  
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const openDropdown = () => {
  isOpen.value = true
  searchQuery.value = ''
  highlightedIndex.value = -1
  
  // Determine dropdown position
  nextTick(() => {
    if (selectContainer.value) {
      const rect = selectContainer.value.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      dropdownPosition.value = spaceBelow < 250 && spaceAbove > spaceBelow ? 'up' : 'down'
    }
    
    // Focus search input
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  closeDropdown()
}

const selectFirstOption = () => {
  if (filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0])
  }
}

const navigateUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  } else if (filteredOptions.value.length > 0) {
    highlightedIndex.value = filteredOptions.value.length - 1
  }
}

const navigateDown = () => {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++
  } else if (filteredOptions.value.length > 0) {
    highlightedIndex.value = 0
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for external changes
watch(() => props.options, () => {
  // Reset search when options change
  if (isOpen.value) {
    searchQuery.value = ''
    highlightedIndex.value = -1
  }
})
</script>