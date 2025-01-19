<template>
    <div class="container_box">
    <div class="content_box h-5rem w-full mx-10 relative">
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
         
        <div v-if="openForm"> <CreateTimeline/> </div>
        <div v-if="inInfo"> <InfoComp :lineId="selectedLineId"></InfoComp> </div>
        <div v-if="inSettings"> <SettingsComp :lineId="selectedLineId"></SettingsComp> </div>
        <div v-if="!inInfo && !inSettings && !openForm">
          <h2>Přehled časových os</h2>
          
          <div class="container">
            <UButton v-if="user" icon="heroicons:plus-circle-20-solid" @click="toggleForm" class="w-fit btn mb-4" block label="Vytvořit osu" ></UButton>
          </div>
         
          
          <UTabs :items="[
            { label: 'Vybrané' },
            ...(user ? [{ label: 'Moje osy' }, { label: 'Uložené' }] : [])
          ]" :default-index="0" @change="onChange"/>
          
          <!-- Lines List -->
          <div v-if="lines && lines.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <LineCard v-for="line in lines" :key="line.line_id" :line="line" @infoToggle="handleInfoToggle" @settingsToggle="handleSettingsToggle" />
          </div>
          <p v-else class="text-gray-500">No lines created yet.</p>
        </div>
      </div>
    </div>
</template>

<script setup>
import CreateTimeline from '~/components/CreateTimeline.vue';
import SettingsComp from '~/components/SettingsComp.vue';
import InfoComp  from '~/components/InfoComp.vue';
import LineCard from '~/components/LineCard.vue';
import {fetchTimelines } from "~/composables/useSupabase";
import { ref } from 'vue';
import { toggleForm, toggleInfo, toggleSettings, inSettings, inInfo } from '~/composables/state';



const user = useSupabaseUser();
const lines = ref([]);
const selectedTab = ref(0);

// Fetch all timelines for the authenticated user
const fetchTimelinesByTab = async () => {
  if (selectedTab.value === 1 && user?.value?.id) {
    // Fetch "Moje osy" (user's timelines)
    lines.value = await fetchTimelines({ userTimelines: true }, user.value.id);
  } else if (selectedTab.value === 0) {
    // Fetch "Vybrané" (featured timelines)
    lines.value = await fetchTimelines({ featured: true });
  } else if (selectedTab.value === 2 && user?.value?.id) {
    // Fetch "Uložené" (bookmarked timelines)
    lines.value = await fetchTimelines({ bookmarked: true }, user.value.id);
  } else {
    lines.value = [];
  }
};


// Watch for tab changes
function onChange(index) {
  selectedTab.value = index;
  fetchTimelinesByTab();
}

// Fetch timelines on initial mount
onMounted(fetchTimelinesByTab);

const items = 
[{
  label: 'Vybrané',
}, {
  label: 'Moje osy',
}, {
  label: 'Uložené',
}]

const selectedLineId = ref(null);


function handleInfoToggle(lineId) {
  selectedLineId.value = lineId;
  toggleInfo();
}


function handleSettingsToggle(lineId) {
  selectedLineId.value = lineId;
  toggleSettings();
}
</script>
    
<style  scoped>
   
</style>