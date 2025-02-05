<template>
  
    <div class="container mt-4">
      <div v-if="itemData">
        <h2 class="text-xl font-bold">{{ itemData.name }}</h2>
        <p class="text-sm text-gray-600">{{ formatDate(itemData.start) }} - {{ formatDate(itemData.end) }}</p>
        <p class="mt-2">{{ itemDescription }}</p>
  
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
      <div v-else>
        <p>Loading item information...</p>
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
  
  
  function formatDate(ms) {
    const date = new Date(ms);
    return `${date.getFullYear()}`;
  }
  
  async function loadItemData() {
  try {
    const items = await fetchItemsByTag(id, content);

    if (items.length > 0) {
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
        console.warn('No suitable item found.');
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
    } else {
      console.warn('No items found.');
    }
  } catch (err) {
    console.error('Error loading item data:', err);
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
  </style>
  