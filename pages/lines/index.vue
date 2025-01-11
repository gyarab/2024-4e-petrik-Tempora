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
          
          <UButton v-if="user" @click="toggleForm" class="btn" block label="Vytvořit osu" ></UButton>
          
          <!-- Lines List -->
          <h2 class="text-lg font-medium mb-2">My timelines</h2>
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



// Fetch all timelines for the authenticated user
const fetchAllTimelines = async () => {
  if (!user?.value?.id) return;

  try {
    lines.value = await fetchTimelines(user.value.id);
  } catch (error) {
    console.error("Error fetching timelines:", error.message);
  }
};

// Fetch timelines on component mount
onMounted(fetchAllTimelines);
</script>
    
<style  scoped>
   
</style>