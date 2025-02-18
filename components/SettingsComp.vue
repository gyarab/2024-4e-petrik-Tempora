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
  <div v-for="groupId in 8" :key="groupId" class="mt-2">
    <UInput v-model="groupLabels[groupId]" type="text" :placeholder="`Název řádku ${groupId}`" />
  </div>
  
  <UButton
    class="mt-3"
    type="submit"
    :disabled="isLoading"
    @click="saveSettings"
    label="Uložit nastavení"
  ></UButton>
  
  <UButton
    class="mt-3 bg-red-500 text-white"
    :disabled="isDeleting"
    @click="deleteTimelineHandler"
    label="Smazat časovou osu"
  ></UButton>

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
const feedbackMessage = ref("");
const isError = ref(false);
const groupLabels = ref({});
const first = ref("");
const last = ref("");
const isDeleting = ref(false);

const router = useRouter(); 

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
  feedbackMessage.value = "";

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
    feedbackMessage.value = "Nastavení bylo úspěšně uloženo.";
    isError.value = false;
  } catch (err) {
    console.error("Error saving settings:", err);
    feedbackMessage.value = "Nepodařilo se uložit nastavení.";
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const emit = defineEmits(["refreshTimelines"]);
const deleteTimelineHandler = async () => {

  isDeleting.value = true;
  feedbackMessage.value = "";

  try {
    await deleteTimeline(props.lineId);
    feedbackMessage.value = "Časová osa byla úspěšně smazána.";
    isError.value = false;
    toggleOff(); // Close the component after deletion
    emit("refreshTimelines");
    router.push("/lines");

  } catch (err) {
    console.error("Error deleting timeline:", err);
    feedbackMessage.value = "Nepodařilo se smazat časovou osu.";
    isError.value = true;
  } finally {
    isDeleting.value = false;
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
.success {
  color: green;
}
.error {
  color: red;
}
</style>
