<template>
  <div class="absolute top-0 right-0">
    <button @click="toggleOff">
      <Icon class="size-8" name="uil:multiply"></Icon>
    </button>
  </div>
  
  <p>Jméno osy: <span class="font-bold">{{ timelineInfo.name || "Neznámé" }}</span></p>
  <p>ID časové osy: <span class="font-bold">{{ timelineInfo.line_id }}</span></p>
  <p> Autor: <span class="font-bold">{{ timelineInfo.user_profiles?.nickname || "Neznámý" }} </span> </p>
  <p> Vytvořeno: <span class="font-bold">{{ timelineInfo.created_at ? new Date(timelineInfo.created_at).toLocaleDateString() : "Neznámé datum" }}</span> </p>
  <p> Roky: <span class="font-bold">{{ displayStartYear }} - {{ displayEndYear }}</span> </p>
  <p> Soukromá osa: <span class="font-bold">{{ timelineInfo.is_private ? "Ano" : "Ne" }}</span></p>
  <p>Popis: <span class="italic">{{ timelineInfo.description || "Žádný popis" }}</span></p>

  <div class="mt-4">
    <p class="font-bold">Řádky:</p>
    <ul>
      <li v-for="groupId in 8" :key="groupId">
        <span class="font-semibold">Řádek {{ groupId }}:</span>
        {{ groupLabels[groupId] }}
      </li>
    </ul>
  </div>

</template>
<script setup>
  import { toggleOff } from '../composables/state';
  import { fetchInfo } from '../composables/useSupabase';
  
   
  const timelineInfo = ref({});    
  const groupLabels = ref({});  

  const props = defineProps({
    lineId: {
      type: Number,
      required: true,
    },
  });


  watch(
  () => props.lineId,
    async (newLineId) => {
      try {
        timelineInfo.value = await fetchInfo(newLineId);
        groupLabels.value = timelineInfo.value.groups || {};
      } catch (err) {
        console.error("Error loading timeline info:", err);
      }
    },
    { immediate: true }
  );

const displayStartYear = computed(() => {
  return timelineInfo.value.start < 0 ? `${Math.abs(timelineInfo.value.start)} BC` : timelineInfo.value.start;
});

const displayEndYear = computed(() => {
  return timelineInfo.value.end < 0 ? `${Math.abs(timelineInfo.value.end)} BC` : timelineInfo.value.end;
});

</script>

<style scoped>

</style>