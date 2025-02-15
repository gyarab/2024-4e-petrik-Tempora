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
    <UCheckbox v-if="creatingNew" class="self-center" v-model="isBottom" label="Bottom" />
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
import { createNewItem, loadItemData, handleItemUpdate } from '~/composables/itemManipulation';
 


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


function discardChanges() {
  console.clear();
  console.log(isBottom.value)
  console.log(contextType.value)
}


const selectedColor = ref('#BAE6FD');

// Watch for color changes and emit to parent
watch(selectedColor, (newColor) => {
  emit('update-background', newColor);
});

const emit = defineEmits(['update-background']);




onMounted(async () => {
  if (!creatingNew.value) {
    try {
      const data = await loadItemData(id, content);
      if (data) {
        // Destructure data and assign to refs
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