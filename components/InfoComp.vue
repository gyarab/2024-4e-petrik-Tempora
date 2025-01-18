<template>
  <div class="absolute top-0 right-0">
    <button @click="toggleOff">
      <Icon class="size-8" name="uil:multiply"></Icon>
    </button>
  </div>
  
  <p>Jméno osy: {{ timelineInfo.name }}</p>
  <p>ID časové osy: {{ timelineInfo.line_id }}</p>
  <p>Autor: {{ timelineInfo.user_profiles?.nickname || "Unknown" }}</p>
  <p>Vytvořeno: {{ new Date(timelineInfo.created_at).toLocaleDateString() }}</p>
  <p>Popis: {{ timelineInfo.description }}</p>
</template>

<script setup>
  import { toggleOff } from '../composables/state';
  import { fetchInfo } from '../composables/useSupabase';
  

  // Get route and user info
   
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