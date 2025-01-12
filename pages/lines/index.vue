<template>
    <div class="container_box">
    <div class="content_box h-5rem w-full mx-10 relative">
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
        
        <div v-if="openForm">
          <CreateTimeline/>
        </div>
        <div v-else>
          <h2>Přehled časových os</h2>
          
          <UButton v-if="user" @click="toggleForm" class="w-fit btn" block label="Vytvořit osu" ></UButton>
          
          <UTabs :items="[
            { label: 'Vybrané' },
            ...(user ? [{ label: 'Moje osy' }, { label: 'Uložené' }] : [])
          ]" :default-index="0" @change="onChange"/>
          
          <!-- Lines List -->
          <div v-if="lines && lines.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <LineCard v-for="line in lines" :key="line.line_id" :line="line" />
          </div>
          <p v-else class="text-gray-500">No lines created yet.</p>
        </div>
      </div>
    </div>
</template>

<script setup>
import LineCard from '~/components/LineCard.vue';
import {fetchTimelines } from "~/composables/useSupabase";
import CreateTimeline from '~/components/CreateTimeline.vue';
import { ref } from 'vue';
import { toggleForm } from '~/composables/state';


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
  } else {
    // Handle other tabs (e.g., "Uložené") - empty for now
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

</script>
    
<style  scoped>
   
</style>