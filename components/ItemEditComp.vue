<template >
  
  <UTabs v-if="creatingNew" :items="items" @change="onChange" />
  
  <color-picker
  :with-hex-input=true
  v-model="selectedColor"
    v-slot="{ color, show }"    
  >
    <UButton icon="uil:palette" @click="show">  </UButton>
  </color-picker>
  <!--@change="console.log('New color:', $event)"
    @close="console.log('ColorPicker is closed')" -->


  <div class="container">
    <UInput type="number" size="xl" v-model="start" />
    <UCheckbox class="self-center" v-model="isBottom" label="Bottom" />
    <UInput type="number" size="xl" v-model="end" />
  </div>

  <div class="mt-4" >
    <UInput v-model="mainTitle" placeholder="Název hlavní události" />
    <UTextarea v-model="mainDescription" autoresize placeholder="Popis hlavní události (období)" />
  </div>

  <div v-if="!contextType">
    <UButton v-if="!showSecondary" label="Přidat Secondary" @click="showSecondary = true" class="mt-4" />
    <div v-if="showSecondary" class="mt-4">
      <UInput v-model="secondaryTitle" placeholder="Název Secondary" />
      <UTextarea v-model="secondaryDescription" autoresize placeholder="Popis Secondary" />
      <UButton label="Odstranit Secondary" @click="showSecondary = false; showDetail = false" class="mt-2" />
    </div>
  
    <UButton v-if="showSecondary && !showDetail" label="Přidat Detail" @click="showDetail = true" class="mt-4" />
    <div v-if="showDetail" class="mt-4">
      <UInput v-model="detailTitle" placeholder="Název detailu" />
      <UTextarea v-model="detailDescription" autoresize placeholder="Popis detailu" />
      <UButton label="Odstranit Detail" @click="showDetail = false" class="mt-2" />
    </div>
  </div>

  <div class="container mt-4 gap-4">
    <UButton label="Ulozit zmeny" @click="saveChanges" class="mr-4" />
    <UButton label="Zahodit zmeny" @click="discardChanges" />
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { addItem } from '~/composables/supabaseItem';
 


const route = useRoute();
const creatingNew = ref(route.query.creatingNew === 'true');
const { id, content } = route.params;

const items = [
  { label: 'Hlavní událost', icon: 'i-heroicons-information-circle' },
  { label: 'Kontextová událost', icon: 'i-heroicons-eye-dropper' }
];

const contextType = ref(false);
const start = ref(1950);
const end = ref(2020);
const isBottom = ref(false);
const mainTitle = ref('');
const mainDescription = ref('');
const secondaryTitle = ref('');
const secondaryDescription = ref('');
const detailTitle = ref('');
const detailDescription = ref('');
const showSecondary = ref(false);
const showDetail = ref(false);

function onChange(index) {
  contextType.value = index === 1;
}

function convertYearToMs(year) {
  return new Date(year, 0, 1).getTime();
}


function saveChanges()
{
  if(creatingNew.value) {
    createNewItem();
  }
  else {
    updateItem();
  }
}

async function createNewItem() {
  const startMs = convertYearToMs(start.value);
  const endMs = convertYearToMs(end.value);

  if(startMs > endMs) {
    console.error("Start year must be less than end year");
    return;
  }

  if(contextType.value) {
    const contextItem = {
      id: parseInt(content),
      tag: parseInt(content),
      name: mainTitle.value,
      group: isBottom.value ? 8 : 1,
      start: startMs,
      end: endMs,
      cssVariables: { '--item-background': selectedColor.value }
    };
    await addItem(id, contextItem, mainDescription.value);
    return;
  }
  else{
    const mainItem = {
      id: parseInt(content),
      tag: parseInt(content),
      name: mainTitle.value,
      group: isBottom.value ? 5 : 2,
      start: startMs,
      end: endMs,
      cssVariables: { '--item-background': selectedColor.value }
    };
    await addItem(id, mainItem, mainDescription.value);

    if (showSecondary.value) {
      const secondaryItem = {
        id: parseInt(content) + 1,
        tag: parseInt(content),
        name: secondaryTitle.value,
        group: isBottom.value ? 6 : 3,
        start: startMs,
        end: endMs,
        cssVariables: { '--item-background': selectedColor.value }
      };
      await addItem(id, secondaryItem, secondaryDescription.value);
    }

    if (showDetail.value) {
      const detailItem = {
        id: parseInt(content) + 2,
        tag: parseInt(content),
        name: detailTitle.value,
        group: isBottom.value ? 7 : 4,
        start: startMs,
        end: endMs,
        cssVariables: { '--item-background': selectedColor.value }
      };
      await addItem(id, detailItem, detailDescription.value);
    }
  }
}

function discardChanges() {
  console.clear();
}


const selectedColor = ref('#BAE6FD');

// Watch for color changes and emit to parent
watch(selectedColor, (newColor) => {
  emit('update-background', newColor);
});

const emit = defineEmits(['update-background']);




async function loadItemData() {
  if (creatingNew.value) return; // Skip fetching if creating a new item

  try {
    const items = await fetchItemsByTag(id, content);

    if (items.length > 0) {
      const contextItem = items.find(item => item.group === 1 || item.group === 8);
      const regularItem = items.find(item => item.group === 2 || item.group === 5);

      if (contextItem) {
        contextType.value = true;
        start.value = new Date(contextItem.start).getFullYear();
        end.value = new Date(contextItem.end).getFullYear();
        mainTitle.value = contextItem.name;
        mainDescription.value = contextItem.description;
        selectedColor.value = contextItem.cssVariables?.['--item-background'] || '#BAE6FD';
      } else if (regularItem) {
        contextType.value = false;
        start.value = new Date(regularItem.start).getFullYear();
        end.value = new Date(regularItem.end).getFullYear();
        mainTitle.value = regularItem.name;
        mainDescription.value = regularItem.description;
        selectedColor.value = regularItem.cssVariables?.['--item-background'] || '#BAE6FD';
      }

      // Load secondary and detail data
      const secondaryItem = items.find(item => item.group === 3 || item.group === 6);
      if (secondaryItem) {
        showSecondary.value = true;
        secondaryTitle.value = secondaryItem.name;
        secondaryDescription.value = secondaryItem.description;
      }

      const detailItem = items.find(item => item.group === 4 || item.group === 7);
      if (detailItem) {
        showDetail.value = true;
        detailTitle.value = detailItem.name;
        detailDescription.value = detailItem.description;
      }
    } else {
      console.warn("No items found.");
    }
  } catch (err) {
    console.error("Error loading item data:", err);
  }
}

onMounted(() => {
  loadItemData();
});

</script>

<style scoped>
.container {
  display: flex;
  gap: 10px;
}
</style>