<template>
    <div class="container_box">
    <div class="content_box h-5rem w-full mx-10">
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
        <h2>Lines hub page</h2>
        <p> Lines created: </p>
        
        <NuxtLink class="btn" to="/lines/1">Goto timeline one (test)</NuxtLink>
       
         <!-- New Line Form -->
         <UCard class="mb-5">
        <form @submit.prevent="handleCreate">
            <div class="space-y-4">
            <!-- Name Input -->
            <UInput
                v-model="name"
                type="text"
                placeholder="Enter the timeline name"
                required
                label="Name"
            />

            <!-- Start Input -->
            <UInput
                v-model.number="start"
                type="number"
                placeholder="Enter start value"
                required
                label="Start (smallint)"
            />

            <!-- End Input -->
            <UInput
                v-model.number="end"
                type="number"
                placeholder="Enter end value"
                required
                label="End (smallint)"
            />

            <!-- Submit Button -->
            <UButton type="submit" variant="ghost" block>
                Create New Line
            </UButton>
            </div>
        </form>
        </UCard>

      <!-- Lines List -->
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
import { addTimeline, fetchTimelines } from "~/composables/useSupabase";

import { ref } from 'vue';


// State
const user = useSupabaseUser();
const lines = ref([]);
const name = ref("");
const start = ref(null);
const end = ref(null);
const timelines = ref([]);

const handleCreate = async () => {
  if (!user?.value?.id) {
    console.error("User is not authenticated.");
    return;
  }

  try {
    const newTimeline = {
      name: name.value,
      start: start.value,
      end: end.value,
    };

    // Add the timeline using the composable
    console.log(user.value.id);
    await addTimeline(newTimeline, user.value.id);

    alert("Timeline created successfully!");
    name.value = "";
    start.value = null;
    end.value = null;

    // Refresh the list of timelines
    timelines.value = await fetchTimelines(user.value.id);
  } catch (error) {
    console.error("Error creating timeline:", error.message);
  }
};

// Fetch timelines on component mount
const fetchAllTimelines = async () => {
  if (!user?.value?.id) return;

  try {
    timelines.value = await fetchTimelines(user.value.id);
  } catch (error) {
    console.error("Error fetching timelines:", error.message);
  }
};

fetchAllTimelines();
</script>
    
<style  scoped>
   
</style>