<template>
  <div class="bg-white dark:bg-zinc-800 p-6 pt-8 rounded-lg border-2 border-black shadow-lg w-full max-w-5xl">
    <!-- Close Button -->
    <div class="absolute top-2 right-2">
      <button 
        @click="toggleOff"
      >
        <Icon class="size-6" name="uil:multiply"/>
      </button>
    </div>
    
    <!-- Main Content Container -->
    <div class="flex flex-col md:flex-row gap-6 w-full ">
      
      <!-- Timeline Information -->
      <div class="flex-1 space-y-4 min-w-0">
        <h2 class="text-2xl font-bold text-sky-700 dark:text-sky-300 mb-4 pr-8">
          Informace o časové ose
        </h2>
        
        <div class="grid gap-2">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
            <span class="text-gray-600 dark:text-gray-400">Jméno osy:</span>
            <span class="font-bold">{{ timelineInfo.name || "Neznámé" }}</span>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
            <span class="text-gray-600 dark:text-gray-400">ID časové osy:</span>
            <span class="font-bold">{{ timelineInfo.line_id }}</span>
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
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b dark:border-zinc-700">
            <span class="text-gray-600 dark:text-gray-400">Soukromá osa:</span>
            <span class="font-bold">{{ timelineInfo.is_private ? "Ano" : "Ne" }}</span>
          </div>
          
          <div class="flex flex-col py-2 border-b dark:border-zinc-700">
            <span class="text-gray-600 dark:text-gray-400 mb-1">Popis:</span>
            <p class="italic">{{ timelineInfo.description || "Žádný popis" }}</p>
          </div>
        </div>
      </div>

      <!-- Groups Section -->
      <div class="md:w-80 flex-shrink-0">
        <h3 class="font-bold text-lg mb-3">Řádky:</h3>
        <div class="flex flex-col gap-2">
          <div 
            v-for="groupId in 8" 
            :key="groupId"
            class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-700 rounded border-2 border-black"
          >
            <span class="font-semibold min-w-[24px]">{{ groupId }}:</span>
            <span class="text-gray-700 dark:text-gray-300 truncate">
              {{ groupLabels[groupId] || 'Nepojmenovaný' }}
            </span>
          </div>
        </div>
      </div>
    </div>
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
.grid > div:last-child {
  border-bottom: none;
}
</style>