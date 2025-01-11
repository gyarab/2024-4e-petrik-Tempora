<template>
    <div class="container_box">
    <div class="content_box h-5rem w-full mx-10">
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
        <h2>Přehled časových os</h2>
        
        <NuxtLink class="btn" to="/lines/1">Goto timeline one (test)</NuxtLink>
       
        <div v-if="true">
          <CreateTimeline/>
        </div>
         

      <!-- Lines List -->
      <h2> My timelines </h2>
      <div v-if="lines && lines.length > 0">
        <div v-for="line in lines" :key="line.line_id">
          <LineCard :line="line" />
        </div>
      </div>
      <p v-else>No lines created yet.</p>
    </div>
    </div>
</template>

<script setup>
import LineCard from '~/components/LineCard.vue';
import {fetchTimelines } from "~/composables/useSupabase";
import CreateTimeline from '~/components/CreateTimeline.vue';
import { ref } from 'vue';




// State
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