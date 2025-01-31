<template>
  <UTabs :items="items" @change="onChange" />
  
  <div class="container">
    <UInput type="number" size="xl" v-model="start" />
    <UCheckbox v-model="isBottom" label="Bottom" />
    <UInput type="number" size="xl" v-model="end" />
  </div>

  <UInput v-model="mainTitle" placeholder="Název hlavní události" />
  <UTextarea v-model="mainDescription" autoresize placeholder="Popis hlavní události (období)" />
  
  <div v-if="!contextType">
    <UInput v-model="secondaryTitle" placeholder="Název Secondary" />
    <UTextarea v-model="secondaryDescription" autoresize placeholder="Popis Secondary" />
  </div>
  
  <div v-if="!contextType">
    <UInput v-model="detailTitle" placeholder="Název detailu" />
    <UTextarea v-model="detailDescription" autoresize placeholder="Popis detailu" />
  </div>
  
  <UButton label="Ulozit zmeny" @click="saveChanges" />
  <UButton label="Zahodit zmeny" @click="discardChanges" />
</template>

<script setup>
import { ref } from 'vue';

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

function saveChanges() {
  if (contextType.value) {
    console.log({
      group: isBottom.value ? 8 : 1,
      name: mainTitle.value,
      description: mainDescription.value,
      start: start.value,
      end: end.value
    });
  } else {
    console.log(
      {
        group: isBottom.value ? 5 : 2,
        name: mainTitle.value,
        //description: mainDescription.value,
        start: start.value,
        end: end.value
      },
      {
        group: isBottom.value ? 6 : 3,
        name: secondaryTitle.value,
        //description: secondaryDescription.value
        start: start.value,
        end: end.value
      },
      {
        group: isBottom.value ? 7 : 4,
        name: detailTitle.value,
        //description: detailDescription.value
        start: start.value,
        end: end.value
      }
    );
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