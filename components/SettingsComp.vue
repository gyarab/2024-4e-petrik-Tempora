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
  <p>Rok:  <span class="font-bold"> {{ first }} - {{ last }} </span></p>

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
  
  <UButton
    class="mt-3"
    type="submit"
    :disabled="isLoading"
    @click="saveSettings"
    label="Uložit nastavení"
  ></UButton>
  <p v-if="feedbackMessage" :class="{ success: !isError, error: isError }"> {{ feedbackMessage }} </p>
</template>

<script setup>
import { toggleOff } from "../composables/state";
import { fetchInfo, updateSettings } from "../composables/useSupabase";
import { ref, watch } from "vue";

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
const first = ref("");
const last = ref("");


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
    await updateSettings(props.lineId, {
      name: newName.value,
      is_private: is_private.value,
      description: newDesc.value,
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
</script>

<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
</style>
