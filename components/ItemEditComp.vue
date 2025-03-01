<template>
  <div class="bg-white dark:bg-zinc-800 p-6 rounded-lg border-2 border-black shadow-lg w-full">
    <!-- Tabs for new items -->
    <UTabs v-if="creatingNew" :items="items" color="sky" @change="onChange" />
    
    <!-- Main Content -->
    <div class="space-y-8">
      <!-- Date and Settings Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center mt-4">
        <UInput 
          type="number" 
          color="sky"
          size="lg"
          v-model="start" 
          :min="MIN_YEAR+1"
          :max="MAX_YEAR"
          required
          placeholder="Začátek události"
        />
        <UInput 
          type="number"
          color="sky" 
          size="lg"
          v-model="end" 
          :min="MIN_YEAR"
          :max="MAX_YEAR-1"
          required
          placeholder="Konec události"
        />
        <div class="justify-self-center flex">
          <UToggle 
            size="xl" 
            v-model="isBottom" 
            color="sky"
            on-icon="heroicons:chevron-down-solid"
            off-icon="heroicons:chevron-up-solid"
          />
          <p class="ml-4"> Spodní část </p>
        </div>
        
        <div class="justify-self-center flex">
          <color-picker
          :with-hex-input=true
          v-model="selectedColor"
          v-slot="{ color, show }"    
        >
          <UButton 
            icon="uil:palette" 
            color="sky"
            @click="show" 
            size="lg"
            class="rounded-md border-black border-2 p-2 "
          />
        </color-picker>
          <p class="ml-4 self-center"> Barva události </p>
        </div>
        
      </div>

      <!-- Main Event Section -->
      <div class="space-y-4">
        <UInput 
          v-model="mainTitle" 
          color="sky"
          size="lg"
          placeholder="Název hlavní události" 
        />
        <QuillEditor v-model="mainDescription" />
      </div>

      <!-- Secondary Section -->
      <div v-if="!contextType" class="space-y-4">
        <UButton 
          v-if="!showSecondary" 
          color="sky"
          label="Přidat Secondary" 
          @click="showSecondary = true" 
          class="rounded-md border-black border-2 p-2"
        />
        
        <div v-if="showSecondary" class="space-y-4">
          <div class="flex items-center gap-2">
            <UInput 
              v-model="secondaryTitle" 
              color="sky"
              size="lg"
              placeholder="Název Secondary" 
              class="flex-grow" 
            />
            <UButton 
              icon="heroicons:minus"
              color="sky"
              variant="ghost"
              @click="showSecondary = false; showDetail = false"
              class="rounded-md border-black border-2 p-2"
            />
          </div>
          <QuillEditor v-model="secondaryDescription" />
        </div>

        <!-- Detail Section -->
        <UButton 
          v-if="showSecondary && !showDetail" 
          color="sky"
          label="Přidat Detail" 
          @click="showDetail = true" 
          class="rounded-md border-black border-2 p-2"
        />
        
        <div v-if="showDetail" class="space-y-4">
          <div class="flex items-center gap-2">
            <UInput 
              v-model="detailTitle" 
              color="sky"
              size="lg"
              placeholder="Název detailu" 
              class="flex-grow" 
            />
            <UButton 
              icon="heroicons:minus"
              color="sky"
              variant="ghost"
              @click="showDetail = false"
              class="rounded-md border-black border-2 p-2"
            />
          </div>
          <QuillEditor v-model="detailDescription" />
        </div>
      </div>

      <!-- Actions Section -->
      <div class="flex justify-between items-center border-t dark:border-zinc-700 pt-6">
        <div class="flex gap-4">
          <UButton 
            label="Uložit změny" 
            color="sky"
            @click="saveChanges" 
            class="rounded-md border-black border-2 p-2"
          />
          <UButton 
            v-if="!creatingNew" 
            color="sky"
            variant="soft"
            label="Zahodit změny" 
            @click="discardChanges" 
            class="rounded-md border-black border-2 p-2"
          />
        </div>
        <UButton 
          v-if="!creatingNew"
          label="Smazat událost" 
          color="red"
          variant="soft"
          @click="isDeleteModalOpen = true"
          class="rounded-md border-black border-2 p-2"
        />
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <UModal v-model="isDeleteModalOpen">
    <div class="p-4">
      <h3 class="text-xl font-bold mb-4">Potvrdit smazání</h3>
      <p class="mb-4">Opravdu chcete smazat tuto událost? Tato akce je nevratná.</p>
      <div class="flex justify-end gap-2">
        <UButton
          color="sky"
          variant="soft"
          label="Zrušit"
          @click="isDeleteModalOpen = false"
          class="rounded-md border-black border-2 p-2"
        />
        <UButton
          color="red"
          variant="soft"
          label="Smazat"
          @click="handleDelete"
          class="rounded-md border-black border-2 p-2"
        />
      </div>
    </div>
  </UModal>

  <UNotifications/>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { createNewItem, loadItemData, handleItemUpdate } from '~/composables/itemManipulation';
import { removeItemsByTag } from '~/composables/supabaseItem';
import QuillEditor from '~/components/QuillEditor.vue';


const MIN_YEAR = -12000//-271820
const MAX_YEAR = 12000//275760
const toast = useToast();
const router = useRouter();
const route = useRoute();
const creatingNew = ref(route.query.creatingNew === 'true');
const { id, content } = route.params;

const items = [
  { label: 'Hlavní událost', icon: 'i-heroicons-information-circle' },
  { label: 'Kontextová událost', icon: 'heroicons:chat-bubble-bottom-center-text' }
];

const contextType = ref(false);
const start = ref('');
const end = ref('');
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
  if(start.value >= end.value) {
    toast.add({
      title: 'Chyba při ukládání',
      description: 'Začátek události nemůže být později než její konec, minimální trvání je jeden rok',
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
      router.push(`/lines/${id}`);
    } else {
      await handleItemUpdate({
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

      toast.add({
        title: 'Změny uloženy',
        description: 'Změny byly úspěšně uloženy',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 1000,
      });
    }
  } catch (error) {
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
          start: start.value ,
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
/* Keep styles consistent with ItemInfoComp */
:deep(.quill-content) {
  line-height: 1.6;
}

.space-y-8 > * {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

:deep(.quill-editor) {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

:deep(.dark .quill-editor) {
  border-color: rgb(63 63 70);
}
</style>