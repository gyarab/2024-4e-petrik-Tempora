<template>
  <div class="bg-white dark:bg-zinc-800 p-6 pt-8 mt-4 rounded-lg border-2 border-black shadow-lg w-full max-w-5xl">
    <!-- Close Button -->
    <div class="absolute top-4 right-4">
      <button 
        @click="toggleOff"
      >
        <Icon class="size-6" name="uil:multiply"/>
      </button>
    </div>
    
    <!-- Main Content Container -->
    <div class="flex flex-col md:flex-row gap-6 w-full">
      <!-- Settings Information -->
      <div class="flex-1 space-y-4  min-w-0">
        <h2 class="text-2xl font-bold text-sky-700 dark:text-sky-300 mb-4">
          Nastavení časové osy
        </h2>
        
        <div class="grid gap-4">
          <!-- Timeline Name -->
          <div class="space-y-2">
            <label class="text-gray-600 dark:text-gray-400">Jméno osy:</label>
            <UInput
              v-model="newName"
              color="sky"
              type="text"
              placeholder="Zadejte nové jméno osy"
              class="w-full"
            />
          </div>

          <!-- Timeline Info -->
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
              <span class="text-gray-600 dark:text-gray-400">ID časové osy:</span>
              <span class="font-bold">{{ timelineInfo.line_id || "Neznámý" }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
              <span class="text-gray-600 dark:text-gray-400">Autor:</span>
              <span class="font-bold">{{ timelineInfo.user_profiles?.nickname || "Neznámý" }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
              <span class="text-gray-600 dark:text-gray-400">Vytvořeno:</span>
              <span class="font-bold">{{ timelineInfo.created_at ? new Date(timelineInfo.created_at).toLocaleDateString() : "Neznámé datum" }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
              <span class="text-gray-600 dark:text-gray-400">Roky:</span>
              <span class="font-bold">{{ displayStartYear }} - {{ displayEndYear }}</span>
            </div>
          </div>

          <!-- Privacy Setting -->
          <div class=" flex py-2">
            <UToggle 
              size="lg" 
              v-model="is_private"
              name="private"
              color="sky"
              on-icon="heroicons:lock-closed"
              off-icon="heroicons:lock-open"
              class=""
            />
            <p class="ml-4"> Soukromá osa </p>
          </div>
        

          <!-- Description -->
          <div class="space-y-2">
            <label class="text-gray-600 dark:text-gray-400">Popis:</label>
            <UTextarea
              v-model="newDesc"
              color="sky"
              :autoresize="true"
              placeholder="Zadejte popis osy"
              class="w-full"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center pt-4">
            <UButton
              class="skyButton"
              :loading="isLoading"
              @click="saveSettings"
              label="Uložit nastavení"
            />
            
            <UButton
              color="red"
              class="rounded-md border-black border-2"
              :loading="isDeleting"
              @click="isDeleteModalOpen = true"
              label="Smazat časovou osu"
            />
          </div>
        </div>
      </div>

      <!-- Groups Section -->
      <div class="md:w-80 flex-shrink-0">
        <h3 class="font-bold text-lg mb-3">Názvy řádků:</h3>
        <div class="flex flex-col gap-2">
          <div 
            v-for="groupId in 8" 
            :key="groupId"
            class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-700 rounded border-2 border-black"
          >
            <span class="font-semibold min-w-[24px]">{{ groupId }}:</span>
            <UInput 
              v-model="groupLabels[groupId]"
              color="sky"
              type="text" 
              :placeholder="`Název řádku ${groupId}`"
              class="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <UModal v-model="isDeleteModalOpen">
    <div class="p-4">
      <h3 class="text-lg font-bold mb-4">Potvrdit smazání</h3>
      <p class="mb-4">Opravdu chcete smazat tuto časovou osu? Tato akce je nevratná a smaže tuto osu a všechny události v ní.</p>
      <div class="flex justify-end gap-2">
        <UButton
          color="gray"
          label="Zrušit"
          @click="isDeleteModalOpen = false"
        />
        <UButton
          color="red"
          label="Smazat"
          :loading="isDeleting"
          @click="deleteTimelineHandler"
        />
      </div>
    </div>
  </UModal>

  <UNotifications />
</template>

<script setup>
import { toggleOff } from "../composables/state";
import { fetchInfo, updateSettings, deleteTimeline  } from "../composables/useSupabase";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const timelineInfo = ref({});

const props = defineProps({
  lineId: {
    type: Number,
    required: true,
  },
});

const is_private = ref(false);
const newName = ref("");
const newDesc = ref("");
const isLoading = ref(false);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const groupLabels = ref({});
const first = ref("");
const last = ref("");

const router = useRouter(); 
const toast = useToast();

watch(
  () => props.lineId,
  async (newLineId) => {
    try {
      timelineInfo.value = await fetchInfo(newLineId);
      newName.value = timelineInfo.value.name;
      is_private.value = timelineInfo.value.is_private;
      newDesc.value = timelineInfo.value.description;
      first.value = timelineInfo.value.start;
      last.value = timelineInfo.value.end; 

      // Load existing group names if available
      const existingGroups = timelineInfo.value.groups || {};
      for (let i = 1; i <= 8; i++) {
        groupLabels.value[i] = existingGroups[i] || "";
      }
    } catch (err) {
      console.error("Error loading timeline info:", err);
    }
  },
  { immediate: true }
);

const saveSettings = async () => {
  isLoading.value = true;

  try {
    const groupUpdates = {};
    for (let i = 1; i <= 8; i++) {
      groupUpdates[i] = groupLabels.value[i] || `Group ${i}`;
    }

    await updateSettings(props.lineId, {
      name: newName.value,
      is_private: is_private.value,
      description: newDesc.value,
      groups: groupUpdates,
    });
    
    toast.add({
      title: 'Nastavení uloženo',
      description: 'Změny byly úspěšně uloženy',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000,
    });
  } catch (err) {
    toast.add({
      title: 'Chyba při ukládání',
      description: 'Nepodařilo se uložit nastavení',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const emit = defineEmits(["refreshTimelines"]);

const deleteTimelineHandler = async () => {
  isDeleting.value = true;

  try {
    // First, navigate away from the timeline
    await navigateTo('/lines');
    // Then delete the timeline
    await deleteTimeline(props.lineId);
    // Close the settings modal
    toggleOff();
    // Emit the refresh event
    emit("refreshTimelines");
    // Show success notification
    toast.add({
      title: 'Časová osa smazána',
      description: `Časová osa byla úspěšně odstraněna `,
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000,
    });
  } catch (err) {
    toast.add({
      title: 'Chyba při mazání',
      description: 'Nepodařilo se smazat časovou osu',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
    });
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
};

const displayStartYear = computed(() => {
  return timelineInfo.value.start < 0 ? `${Math.abs(timelineInfo.value.start)} BC` : timelineInfo.value.start;
});

const displayEndYear = computed(() => {
  return timelineInfo.value.end < 0 ? `${Math.abs(timelineInfo.value.end)} BC` : timelineInfo.value.end;
});

</script>

<style scoped>

</style>
