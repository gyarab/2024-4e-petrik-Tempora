<template>
    <div class="line-card border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm dark:bg-gray-800 dark:border-gray-950" >
      <h3 class="font-bold text-lg">{{ line.name }}
        <UIcon v-if="line.is_private" class="size-4" name="heroicons:lock-closed-16-solid"></UIcon>
        <UIcon v-if="line.featured" class="size-4" name="heroicons:star-16-solid"></UIcon>
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">Roky: {{ displayStartYear  }} - {{ displayEndYear }}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300">Autor: {{ line.user_profiles?.nickname || 'Unknown' }}</p>
        
      <div class="text-base container mt-2">
        <!-- Only if user UUID = the Line author UUID  -->
        <button @click="handleInfoToggle(line.line_id)" class="mr-2"> 
          <UTooltip text="Info" :popper="{ placement: 'right' }">
            <Icon class="size-8" name="uil:info-circle"/>
          </UTooltip>
        </button> 

        <button v-if="user" @click="handleSettingsToggle(line.line_id)" > 
          <UTooltip text="Nastavení" :popper="{ placement: 'right' }">
            <Icon class="size-8" name="uil:setting"/>
          </UTooltip>
        </button> 
      </div>

      

      <UButton 
        class="btn text-white px-4 py-2 rounded mt-2" 
        :to="`/lines/${line.line_id}`" 
        label="Přejít na osu">
      </UButton>
    </div>
  </template>
  
  <script setup>
  const user = useSupabaseUser()

  
  const props = defineProps({
    line: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['infoToggle', 'settingsToggle']);
  
  function handleInfoToggle(lineId) {
  emit('infoToggle', lineId);
}

function handleSettingsToggle(lineId) {
  emit('settingsToggle', lineId);
}

const displayStartYear = computed(() => {
  return props.line.start < 0 ? `${Math.abs(props.line.start)} BC` : props.line.start;
});

const displayEndYear = computed(() => {
  return props.line.end < 0 ? `${Math.abs(props.line.end)} BC` : props.line.end;
});

</script>