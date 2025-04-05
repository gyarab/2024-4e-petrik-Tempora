<template>
  <Head>
      <Title> Tempora | Lines </Title>
  </Head>
    <div class="container_box">
      <div class="content_box w-full mx-10 relative">
        
        
         
        <div v-if="openForm"> <CreateTimeline/> </div>
        <div v-if="inInfo"> <InfoComp :lineId="selectedLineId"></InfoComp> </div>
        <div v-if="inSettings"> <SettingsComp :lineId="selectedLineId" @refreshTimelines="fetchTimelinesByTab"></SettingsComp> </div>
        <div v-if="!inInfo && !inSettings && !openForm" >
        
          <h2 class="text-3xl font-bold mb-6 text-sky-700 dark:text-sky-300">Přehled časových os</h2>
          
          <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
            <UButton 
              v-if="user" 
              icon="heroicons:plus-circle-20-solid" 
              @click="toggleForm" 
              class="skyButton w-full sm:w-fit" 
              block 
              label="Vytvořit osu" 
            />
            <div class="flex items-center gap-2 w-full sm:w-fit">
              <UInput 
                color="sky"
                v-model="searchId" 
                size="md"
                placeholder="Zadejte ID osy nebo odkaz" 
                class="w-full sm:w-fit bg-white rounded-md dark:bg-gray-800" 
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
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
              <UButton 
                icon="heroicons:magnifying-glass" 
                @click="searchById" 
                label="Hledat" 
                class="skyButton" 
              />
            </div>
          </div>
         
          
          <UTabs 
            v-if="!isSearching"
            class=""
            :items="[
              { label: 'Vybrané', icon: 'heroicons:star' },
              ...(user ? [{ label: 'Moje osy', icon: 'uil:house-user' }, { label: 'Uložené', icon:'heroicons:bookmark' }] : [])
            ]" 
            :default-index="0" 
            @change="onChange"
          />
          
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
            <h2 class="text-xl font-bold text-center text-sky-950 mb-4">Načítání časových os...</h2>
            <div class="w-96 space-y-4">
              <UProgress
                animation="carousel"
                color="sky"
                class="w-full"
                size="md"
              />
            </div>
          </div>

          <!-- Lines List -->
          <div v-else-if="lines && lines.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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


const toast = useToast();

const user = useSupabaseUser();
const lines = ref([]);
const selectedTab = ref(0);
const searchId = ref('');
const isSearching = ref(false);
const isLoading = ref(true);


// Fetch all timelines for the authenticated user
const fetchTimelinesByTab = async () => {
  try {
    isLoading.value = true;
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
  } finally {
    isLoading.value = false;
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
    toast.add({
      title: 'Špatně zadané ID',
      description: 'ID musí obsahovat přesně 6 číslic nebo odkaz na časovou osu',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
      timeout: 3000,
      pauseTimeoutOnHover: false,
    });
    return;
  }
  try {
    isLoading.value = true;
    isSearching.value = true;
    lines.value = await fetchTimelines({ id: searchId.value });
  } finally {
    isLoading.value = false;
  }
};

// Watch for tab changes
function onChange(index) {
  selectedTab.value = index;
  fetchTimelinesByTab();
}

// Fetch timelines on initial mount
onMounted(fetchTimelinesByTab);



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
  fetchTimelinesByTab();
};
</script>
    
<style  scoped>
   
</style>