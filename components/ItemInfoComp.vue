<template>
  <div class="container mt-4">
    <div v-if="error" class="flex flex-col items-center justify-center text-center p-4">
      <Icon name="heroicons:exclamation-circle" class="text-4xl text-red-500 mb-2"/>
      <h2 class="text-2xl font-bold text-red-500">Událost nebyla nalezena</h2>
      <p class="text-gray-800 mt-2">Událost buď neexistuje nebo k ní nemáte přístup.</p>
    </div>
    
    <div v-else-if="itemData">
      <h2 class="text-3xl font-bold">{{ itemData.name }}</h2>
      <p class="text-sm text-gray-600">{{ formatDate(itemData.start) }} - {{ formatDate(itemData.end) }}</p>
      <div class="mt-2 prose prose-sm max-w-none" v-html="itemDescription"></div>

      <div v-if="secondaryData" class="mt-4">
        <h3 class="text-lg font-semibold">{{ secondaryData.name }}</h3>
        <p class="text-sm text-gray-600">{{ formatDate(secondaryData.start) }} - {{ formatDate(secondaryData.end) }}</p>
        <p class="mt-2">{{ secondaryDescription }}</p>
      </div>

      <div v-if="detailData" class="mt-4">
        <h4 class="text-md font-medium">{{ detailData.name }}</h4>
        <p class="text-sm text-gray-600">{{ formatDate(detailData.start) }} - {{ formatDate(detailData.end) }}</p>
        <p class="mt-2">{{ detailDescription }}</p>
      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center">
      <h2 class="text-xl font-bold text-center text-sky-950">Načítání informací o události...</h2>
      <div class="w-96 space-y-4">
        <UProgress
          animation="carousel"
          color="sky"
          class="w-full"
          size="md"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchItemsByTag } from '~/composables/supabaseItem';

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
</style>
