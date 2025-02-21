<template>
  <div class="line-card border-2 border-black p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md flex flex-col justify-between h-full">
    <div>
      <h3 class="font-bold text-lg">{{ line.name }}
        <UIcon v-if="line.is_private" class="size-4" name="heroicons:lock-closed-16-solid"></UIcon>
        <UIcon v-if="line.featured" class="size-4" name="heroicons:star-16-solid"></UIcon>
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">Roky: {{ displayStartYear }} - {{ displayEndYear }}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Autor: 
        <UTooltip v-if="nickname.length > 16" :text="nickname">
          <span>{{ truncatedNickname }}</span>
        </UTooltip>
        <span v-else>{{ nickname }}</span>
      </p>
    </div>
    
    <div class="mt-auto flex flex-col">
      <div class="flex items-center mt-2">
        <button @click="handleInfoToggle(line.line_id)" class="mr-4"> 
          <UTooltip text="Info" :popper="{ placement: 'right' }">
            <Icon class="size-8" name="uil:info-circle"/>
          </UTooltip>
        </button> 

        <button v-if="user" @click="handleSettingsToggle(line.line_id)"> 
          <UTooltip text="Nastavení" :popper="{ placement: 'right' }">
            <Icon class="size-8" name="uil:setting"/>
          </UTooltip>
        </button> 
      </div>

      <UButton 
        class="skyButton px-4 py-2 mt-2" 
        :to="`/lines/${line.line_id}`" 
        label="Přejít na osu">
      </UButton>
    </div>
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

const nickname = computed(() => {
  return props.line.user_profiles?.nickname || 'Unknown'
})

const truncatedNickname = computed(() => {
  if (nickname.value.length > 16) {
    return `${nickname.value.substring(0, 13)}...`
  }
  return nickname.value
})

</script>