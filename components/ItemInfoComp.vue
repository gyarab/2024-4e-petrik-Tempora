<template>
  <div class="bg-white dark:bg-zinc-800 p-6 rounded-lg border-2 border-black shadow-lg w-full">
    <!-- Navigation Arrows - Only show for main items (groups 2 and 5) -->
    <div v-if="[2, 5].includes(itemData?.group)" class="flex justify-between items-center mb-4">
      <UButton
        v-if="previousItem"
        icon="i-heroicons-arrow-left"
        color="sky"
        variant="ghost"
        class="rounded-md border-black dark:border-white border-2 p-2 flex items-center gap-2"
        :to="`/lines/${id}/${previousItem.id}`"
      >
        <span class="text-sm">{{ previousItem.name }}</span>
      </UButton>
      <div class="flex-grow"></div>
      <UButton
        v-if="nextItem"
        icon="i-heroicons-arrow-right-20-solid"
        color="sky"
        variant="ghost"
        class="rounded-md border-black dark:border-white border-2 p-2 flex items-center gap-2"
        :to="`/lines/${id}/${nextItem.id}`"
      >
        <span class="text-sm">{{ nextItem.name }}</span>
      </UButton>
    </div>

    <!-- Error State -->
    <div v-if="error" class="flex flex-col items-center justify-center text-center p-4">
      <Icon name="heroicons:exclamation-circle" class="text-4xl text-red-500 mb-2"/>
      <h2 class="text-2xl font-bold text-red-500">Událost nebyla nalezena</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-2">Událost buď neexistuje nebo k ní nemáte přístup.</p>
    </div>
    
    <!-- Content State -->
    <div v-else-if="itemData" class="space-y-8">
      <!-- Main Header -->
      <div class="text-center py-4 border-b dark:border-zinc-700">
        <h2 class="text-4xl font-bold text-sky-700 dark:text-sky-300">{{ itemData.name }}</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mt-2">
          {{ formatDate(itemData.start) }} - {{ formatDate(itemData.end) }}
        </p>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg max-w-none dark:prose-invert quill-content pb-8 border-b dark:border-zinc-700">
          <div v-html="itemDescription"></div>
        </div>

        <!-- Secondary Content Section -->
        <div v-if="secondaryData" class="mt-8 space-y-4">
          <h3 class="text-2xl font-semibold text-sky-700 dark:text-sky-300">{{ secondaryData.name }}</h3>
          <div class="prose prose-lg max-w-none dark:prose-invert quill-content pb-8 border-b dark:border-zinc-700">
            <div v-html="secondaryDescription"></div>
          </div>
        </div>

        <!-- Detail Content Section -->
        <div v-if="detailData" class="mt-8 space-y-4">
          <h4 class="text-xl font-semibold text-sky-700 dark:text-sky-300">{{ detailData.name }}</h4>
          <div class="prose prose-lg max-w-none dark:prose-invert quill-content">
            <div v-html="detailDescription"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="flex flex-col items-center justify-center py-12">
      <h2 class="text-2xl font-bold text-center text-sky-700 dark:text-sky-300 mb-6">
        Načítání informací o události...
      </h2>
      <UProgress
        animation="carousel"
        color="sky"
        class="w-80"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchItemsByTag } from '~/composables/supabaseItem';
import { storeToRefs } from 'pinia';
import { useTimelineStore } from '~/stores/timeline';

// Define the emit
const emit = defineEmits(['colorSelected']);

const route = useRoute();
const { id, content } = route.params;

const contextType = ref(false);
const itemData = ref(null);
const itemDescription = ref('');
const secondaryData = ref(null);
const secondaryDescription = ref('');
const detailData = ref(null);
const detailDescription = ref('');
const error = ref(false);

const timelineStore = useTimelineStore();
const { topItems, bottomItems } = storeToRefs(timelineStore);

// Update computed properties for navigation
const previousItem = computed(() => {
  if (!itemData.value || ![2, 5].includes(itemData.value.group)) return null;
  
  const currentArray = itemData.value.group === 2 ? topItems.value : bottomItems.value;
  const currentIndex = currentArray.findIndex(item => item.id === parseInt(content));
  return currentIndex > 0 ? currentArray[currentIndex - 1] : null;
});

const nextItem = computed(() => {
  if (!itemData.value || ![2, 5].includes(itemData.value.group)) return null;
  
  const currentArray = itemData.value.group === 2 ? topItems.value : bottomItems.value;
  const currentIndex = currentArray.findIndex(item => item.id === parseInt(content));
  return currentIndex < currentArray.length - 1 ? currentArray[currentIndex + 1] : null;
});

function formatDate(ms) {
  const date = new Date(ms);
  return `${date.getFullYear()}`;
}

async function loadItemData() {
  try {
    const items = await fetchItemsByTag(id, content);

    if (items.length === 0) {
      error.value = true;
      return;
    }

    // Determine if the item is a context item based on groups present in items
    const contextItem = items.find(item => item.group === 1 || item.group === 8);
    const regularItem = items.find(item => item.group === 2 || item.group === 5);

    if (contextItem) {
      contextType.value = true;
      itemData.value = contextItem;
    } else if (regularItem) {
      contextType.value = false;
      itemData.value = regularItem;
    }

    if (itemData.value) {
      itemDescription.value = itemData.value.description;
      const color = itemData.value.cssVariables?.['--item-background'];
      
      if (color) {
        emit('colorSelected', color);
      }
    } else {
      error.value = true;
      return;
    }

    // Load secondary and detail data
    secondaryData.value = items.find(item => item.group === 3 || item.group === 6);
    if (secondaryData.value) {
      secondaryDescription.value = secondaryData.value.description;
    }

    detailData.value = items.find(item => item.group === 4 || item.group === 7);
    if (detailData.value) {
      detailDescription.value = detailData.value.description;
    }
  } catch (err) {
    console.error('Error loading item data:', err);
    error.value = true;
  }
}

onMounted(() => {
  loadItemData();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Style Quill content */
:deep(.ql-align-center) {
  text-align: center;
}

:deep(.ql-align-right) {
  text-align: right;
}

:deep(.ql-align-justify) {
  text-align: justify;
}

:deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 1em 0;
}

:deep(h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 1em 0;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 2em;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 2em;
}

:deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

:deep(.ql-formula) {
  margin: 1em 0;
}

.quill-content {
  line-height: 1.5;
}

.quill-content :deep(p) {
  margin-bottom: 0.5em;
}

/* Keep existing Quill styles but add dark mode support */
:deep(.quill-content) {
  line-height: 1.6;
}

</style>
