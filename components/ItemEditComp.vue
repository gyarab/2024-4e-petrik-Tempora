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
    <QuillEditor v-model="mainDescription" />
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
      <QuillEditor v-model="secondaryDescription" />
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
      <QuillEditor v-model="detailDescription" />
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
      @click="isDeleteModalOpen = true"
    />
  </div>

  <!-- Add Modal Component -->
  <UModal v-model="isDeleteModalOpen">
    <div class="p-4">
      <h3 class="text-lg font-bold mb-4">Potvrdit smazání</h3>
      <p class="mb-4">Opravdu chcete smazat tuto událost? Tato akce je nevratná.</p>
      <div class="flex justify-end gap-2">
        <UButton
          color="gray"
          label="Zrušit"
          @click="isDeleteModalOpen = false"
        />
        <UButton
          color="red"
          label="Smazat"
          @click="handleDelete"
        />
      </div>
    </div>
  </UModal>

  <UNotifications/>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { createNewItem, loadItemData, handleItemUpdate } from '~/composables/itemManipulation';
import { removeItemsByTag } from '~/composables/supabaseItem';
import QuillEditor from '~/components/QuillEditor.vue';
const toast = useToast();

const route = useRoute();
const creatingNew = ref(route.query.creatingNew === 'true');
const { id, content } = route.params;

const items = [
  { label: 'Hlavní událost', icon: 'i-heroicons-information-circle' },
  { label: 'Kontextová událost', icon: 'i-heroicons-eye-dropper' }
];

const contextType = ref(false);
const start = ref(0);
const end = ref(0);
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
const isDeleteModalOpen = ref(false);

function onChange(index) {
  contextType.value = index === 1;
}

async function saveChanges() { 
  if(!(typeof start.value === 'number' &&
  typeof end.value === 'number')) {
    toast.add({
      title: 'Chyba při ukládání',
      description: 'Roky musejí být zadány jako čísla',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
    return;
  }
  if(start.value > end.value) {
    toast.add({
      title: 'Chyba při ukládání',
      description: 'Začátek události nemůže být později než její konec',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
    return;
  }
  
  try {
    if (creatingNew.value) {
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
      
      toast.add({
        title: 'Událost byla vytvořena',
        description: 'Nová událost byla úspěšně přidána do časové osy',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 3000,
      });
    } else {
      await handleItemUpdate({
        isBottom: isBottom.value,
        line_id: id,
        content,
        contextType: contextType.value,
        start: start.value,
        end: end.value,
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

      toast.add({
        title: 'Změny uloženy',
        description: 'Změny byly úspěšně uloženy',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 1000,
      });
    }
  } catch (error) {
    console.error('Failed to save item:', error);
    toast.add({
      title: 'Chyba při ukládání',
      description: 'Nastala chyba při ukládání změn',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
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

async function handleDelete() {
  try {
    await removeItemsByTag(id, content)
    toast.add({
      title: 'Událost smazána',
      description: 'Událost byla úspěšně odstraněna',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000
    })
    isDeleteModalOpen.value = false
    // Navigate back to timeline
    navigateTo(`/lines/${id}`)
  } catch (error) {
    console.error('Failed to delete item:', error)
    toast.add({
      title: 'Chyba při mazání',
      description: 'Nastala chyba při mazání události',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000
    })
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