<template>
  <UTabs :items="items" @change="onChange" />
  
  <div class="container">
    <UInput  type="number" size="xl" v-model="start" />
    <UCheckbox class="self-center" v-model="isBottom" label="Bottom" />
    <UInput type="number" size="xl" v-model="end" />
  </div>

  <div class="mt-4">
    <UInput v-model="mainTitle" placeholder="Název hlavní události" />
    <UTextarea v-model="mainDescription" autoresize placeholder="Popis hlavní události (období)" />
  </div>

  <div v-if="!contextType" class="mt-4">
    <UInput v-model="secondaryTitle" placeholder="Název Secondary" />
    <UTextarea v-model="secondaryDescription" autoresize placeholder="Popis Secondary" />
  </div>
  
  <div v-if="!contextType" class="mt-4">
    <UInput v-model="detailTitle" placeholder="Název detailu" />
    <UTextarea v-model="detailDescription" autoresize placeholder="Popis detailu" />
  </div>
  
  <div class="cointainer mt-4 gap-4" >
    <UButton label="Ulozit zmeny" @click="saveChanges" class="mr-4"/>
    <UButton label="Zahodit zmeny" @click="discardChanges" />
  </div>
  
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { addItem } from '~/composables/supabaseItem';

const route = useRoute();
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

function onChange(index) {
  contextType.value = index === 1;
}

function convertYearToMs(year) {
  return new Date(year, 0, 1).getTime();
}

//TODO osetrit kdyz nejsou vyplnene vsechny udaje tak nepridavat

async function saveChanges() {
  const startMs = convertYearToMs(start.value);
  const endMs = convertYearToMs(end.value);

  const mainItem = {
    id: parseInt(content),
    tag: parseInt(content),
    name: mainTitle.value,
    group: isBottom.value ? 8 : 1,
    start: startMs,
    end: endMs
  };
  await addItem(id, mainItem, mainDescription.value);
  console.log("Inserted main item:", mainItem);

  if (!contextType.value) {
    const secondaryItem = {
      id: parseInt(content) + 1,
      tag: parseInt(content),
      name: secondaryTitle.value,
      group: isBottom.value ? 6 : 3,
      start: startMs,
      end: endMs
    };
    await addItem(id, secondaryItem, secondaryDescription.value);
    console.log("Inserted secondary item:", secondaryItem);

    const detailItem = {
      id: parseInt(content) + 2,
      tag: parseInt(content),
      name: detailTitle.value,
      group: isBottom.value ? 7 : 4,
      start: startMs,
      end: endMs
    };
    await addItem(id, detailItem, detailDescription.value);
    console.log("Inserted detail item:", detailItem);
  }
}

function discardChanges() {
  console.clear();
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 10px;
}
</style>