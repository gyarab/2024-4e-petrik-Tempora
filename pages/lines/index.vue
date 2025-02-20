<template>
    <div class="container_box">
    <div class="content_box w-full mx-10 relative">
        <Head>
            <Title> Tempora | lines </Title>
        </Head>
        
        
         
        <div v-if="openForm"> <CreateTimeline/> </div>
        <div v-if="inInfo"> <InfoComp :lineId="selectedLineId"></InfoComp> </div>
        <div v-if="inSettings"> <SettingsComp :lineId="selectedLineId" @refreshTimelines="fetchTimelinesByTab"></SettingsComp> </div>
        <div v-if="!inInfo && !inSettings && !openForm">
          <h2>Přehled časových os</h2>
          
          <div class="flex items-center justify-between mb-4">
            <UButton v-if="user" icon="heroicons:plus-circle-20-solid" @click="toggleForm" class="btn w-fit" block label="Vytvořit osu" />
            <div class="flex items-center gap-2">
              <UInput v-model="searchId" placeholder="Zadejte ID osy nebo odkaz" class="w-fit" :ui="{ icon: { trailing: { pointer: '' } } }">
                <template #trailing>
                  <UButton
                    v-show="searchId !== ''"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    :padded="false"
                    @click="clearSearch"
                  />
                </template>
                </UInput>     
              <UButton icon="heroicons:magnifying-glass" @click="searchById" label="Hledat" />
            </div>
          </div>
         
          
          <UTabs 
          v-if="!isSearching"
          :items="[
            { label: 'Vybrané' },
            ...(user ? [{ label: 'Moje osy' }, { label: 'Uložené' }] : [])
          ]" :default-index="0" @change="onChange"/>
          
          <!-- Lines List -->
          <div v-if="lines && lines.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <LineCard v-for="line in lines" :key="line.line_id" :line="line" @infoToggle="handleInfoToggle" @settingsToggle="handleSettingsToggle" />
          </div>
          <p v-else class="text-gray-500">Nebyli vytvořeny nebo nalezeny žádné osy</p>
        </div>
      </div>
      <UNotifications/>
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
const searchId = ref('');
const isSearching = ref(false);


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


// Search by ID filter
const searchById = async () => {
  // Extract last 6 digits using regex
  const match = searchId.value.match(/\d{6}$/);
  if (match) {
    searchId.value = match[0];
  }
  
  searchId.value = searchId.value.trim();
  
  if (!/^\d{6}$/.test(searchId.value)) {
    alert('ID musí být přesně 6 číslic.');
    return;
  }
  isSearching.value = true;
  lines.value = await fetchTimelines({ id: searchId.value });
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


const clearSearch = () => {
  searchId.value = '';
  isSearching.value = false;
  fetchTimelinesByTab(); // Restore original tab data
};
</script>
    
<style  scoped>
   
</style>