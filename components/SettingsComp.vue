<template>
  <div class="absolute top-0 right-0">
    <button @click="toggleOff">
      <Icon class="size-8" name="uil:multiply"></Icon>
    </button>
  </div>
  
  <label>Jméno osy: </label>
  <UInput
    v-model="newName"
    :model-value="newName"
    type="text"
    placeholder="Zadejte nové jméno osy"
  ></UInput>
 
  <p>ID časové osy: <span class="font-bold">  {{ timelineInfo.line_id || "Neznámý" }} </span> </p>
  <p>Autor:  <span class="font-bold"> {{ timelineInfo.user_profiles?.nickname || "Neznámý" }} </span></p>
  <p>Vytvořeno:  <span class="font-bold"> {{ timelineInfo.created_at ? new Date(timelineInfo.created_at).toLocaleDateString() : "Neznámé datum" }} </span></p>
  <p>Rok: <span class="font-bold"> {{ displayStartYear }} - {{ displayEndYear }} </span></p>

  <UCheckbox v-model="is_private" name="private" label="Soukromá osa" />
  <div class="mt-3">
    <label>Popis: </label>
    <UTextarea
      :autoresize="true"
      placeholder="Zadejte popis osy"
      v-model="newDesc"
      :model-value="newDesc"
    />
  </div>

  <h3 class="mt-5 font-bold">Názvy řádků:</h3>
  <div v-for="groupId in 8" :key="groupId" :class="{
    
    'mt-2': groupId === 5
  }" >
  <UInput v-model="groupLabels[groupId]" type="text" :placeholder="`Název řádku ${groupId}`" />
</div>
  
<div class="container mt-4 flex justify-between items-center">
  <UButton
    class="mt-3"
    type="submit"
    :disabled="isLoading"
    @click="saveSettings"
    label="Uložit nastavení"
  />
  
  <UButton
    class="mt-3"
    color="red"
    :disabled="isDeleting"
    @click="isDeleteModalOpen = true"
    label="Smazat časovou osu"
  />
</div>

<!-- Add Delete Confirmation Modal -->
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

  <p v-if="feedbackMessage" :class="{ success: !isError, error: isError }"> {{ feedbackMessage }} </p>
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
