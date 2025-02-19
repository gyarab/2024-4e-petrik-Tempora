<template>
  <UTabs v-if="creatingNew" :items="items" @change="onChange" />
  
  <div class="container items-center">
    <UInput type="number" size="xl" v-model="start" />
    <UCheckbox v-if="creatingNew" class="self-center" v-model="isBottom" label="Bottom" />
    <UInput type="number" size="xl" v-model="end" />
    <color-picker
      :with-hex-input=true
      v-model="selectedColor"
      v-slot="{ color, show }"    
    >
      <UButton icon="uil:palette" @click="show" class="self-center"></UButton>
    </color-picker>
  </div>

  <div class="mt-4">
    <UInput v-model="mainTitle" placeholder="Název hlavní události" />
    <UTextarea v-model="mainDescription" autoresize placeholder="Popis hlavní události (období)" />
  </div>

  <div v-if="!contextType">
    <UButton v-if="!showSecondary" label="Přidat Secondary" @click="showSecondary = true" class="mt-4" />
    <div v-if="showSecondary" class="mt-4">
      <div class="flex items-center gap-2">
        <UInput v-model="secondaryTitle" placeholder="Název Secondary" class="flex-grow" />
        <UTooltip text="Odstranit Secondary" :popper="{ placement: 'left' }">
          <UButton 
            icon="heroicons:minus"
            color="black"
            variant="ghost"
            @click="showSecondary = false; showDetail = false"
          />
        </UTooltip>
      </div>
      <UTextarea v-model="secondaryDescription" autoresize placeholder="Popis Secondary" />
    </div>
  
    <UButton v-if="showSecondary && !showDetail" label="Přidat Detail" @click="showDetail = true" class="mt-4" />
    <div v-if="showDetail" class="mt-4">
      <div class="flex items-center gap-2">
        <UInput v-model="detailTitle" placeholder="Název detailu" class="flex-grow" />
        <UTooltip text="Odstranit Detail" :popper="{ placement: 'left' }">
          <UButton 
            icon="heroicons:minus"
            color="black"
            variant="ghost"
            @click="showDetail = false"
          />
        </UTooltip>
      </div>
      <UTextarea v-model="detailDescription" autoresize placeholder="Popis detailu" />
    </div>
  </div>

  <div class="container mt-4 flex justify-between items-center">
    <div class="flex gap-4">
      <UButton label="Uložit změny" @click="saveChanges" />
      <UButton v-if="!creatingNew" label="Zahodit změny" @click="discardChanges" />
    </div>
    <UButton 
      v-if="!creatingNew"
      label="Smazat událost" 
      color="red"
      @click="removeItemsByTag(id,content)" 
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { createNewItem, loadItemData, handleItemUpdate } from '~/composables/itemManipulation';
import { removeItemsByTag } from '~/composables/supabaseItem';

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
const selectedColor = ref('#BAE6FD');

function onChange(index) {
  contextType.value = index === 1;
}

async function saveChanges() {
  if (creatingNew.value) {
    try {
      await createNewItem({
        id,
        content,
        contextType: contextType.value,
        start: start.value,
        end: end.value,
        isBottom: isBottom.value,
        mainTitle: mainTitle.value,
        mainDescription: mainDescription.value,
        showSecondary: showSecondary.value,
        secondaryTitle: secondaryTitle.value,
        secondaryDescription: secondaryDescription.value,
        showDetail: showDetail.value,
        detailTitle: detailTitle.value,
        detailDescription: detailDescription.value,
        selectedColor: selectedColor.value,
      });
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  } else {
    try {
      handleItemUpdate({
        isBottom: isBottom.value,
        line_id: id,
        content,
        contextType: contextType.value,
        start: start.value,
        end: end.value,
        isBottom: isBottom.value,
        mainTitle: mainTitle.value,
        mainDescription: mainDescription.value,
        showSecondary: showSecondary.value,
        secondaryTitle: secondaryTitle.value,
        secondaryDescription: secondaryDescription.value,
        showDetail: showDetail.value,
        detailTitle: detailTitle.value,
        detailDescription: detailDescription.value,
        selectedColor: selectedColor.value,
      });
    }
    catch (error) {
      console.error('Failed to update item:', error);
    }
  }
}

async function discardChanges() {
  try {
    const data = await loadItemData(id, content);
    if (data) {
      ({
        isBottom: isBottom.value,
        contextType: contextType.value,
        start: start.value,
        end: end.value,
        mainTitle: mainTitle.value,
        mainDescription: mainDescription.value,
        selectedColor: selectedColor.value,
        showSecondary: showSecondary.value,
        secondaryTitle: secondaryTitle.value,
        secondaryDescription: secondaryDescription.value,
        showDetail: showDetail.value,
        detailTitle: detailTitle.value,
        detailDescription: detailDescription.value
      } = data);
    }
  } catch (error) {
    console.error('Failed to reload item data:', error);
  }
}

watch(selectedColor, (newColor) => {
  emit('update-background', newColor);
});

const emit = defineEmits(['update-background']);

onMounted(async () => {
  if (!creatingNew.value) {
    try {
      const data = await loadItemData(id, content);
      if (data) {
        ({
          isBottom: isBottom.value,
          contextType: contextType.value,
          start: start.value,
          end: end.value,
          mainTitle: mainTitle.value,
          mainDescription: mainDescription.value,
          selectedColor: selectedColor.value,
          showSecondary: showSecondary.value,
          secondaryTitle: secondaryTitle.value,
          secondaryDescription: secondaryDescription.value,
          showDetail: showDetail.value,
          detailTitle: detailTitle.value,
          detailDescription: detailDescription.value
        } = data);
      }
    } catch (error) {
      console.error('Failed to load item data:', error);
    }
  }
});
</script>

<style scoped>
.container {
  display: flex;
  gap: 10px;
}
</style>