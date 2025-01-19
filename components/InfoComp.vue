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
  <p> Rok: <span class="font-bold">{{ timelineInfo.start }} - {{ timelineInfo.end }}</span> </p>
  <p> Soukromá osa: <span class="font-bold">{{ timelineInfo.is_private ? "Ano" : "Ne" }}</span></p>
  <p>Popis: <span class="italic">{{ timelineInfo.description || "Žádný popis" }}</span></p>
</template>
<script setup>
  import { toggleOff } from '../composables/state';
  import { fetchInfo } from '../composables/useSupabase';
  
   
  const timelineInfo = ref({});    
    
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
      } catch (err) {
        console.error("Error loading timeline info:", err);
      }
    },
    { immediate: true }
  );
</script>

<style scoped>

</style>