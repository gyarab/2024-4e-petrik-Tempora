<template>
  <div>
    <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
    <h2>Timeline Page (ID: {{ id }})</h2>

    <div v-if="user">
      <NuxtLink :to="`${id}/edit`">Edit Timeline</NuxtLink>
    </div>

    <TimelineComponent/>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import TimelineComponent from '~/components/TimelineComponent.vue';

// Get route and user info
const { id } = useRoute().params
const user = useSupabaseUser()

// Error handling for invalid timelines
if (!true) {
  throw createError({ statusCode: 404, statusMessage: 'Timeline not found', fatal: true });
}
</script>

<style scoped>
/* Timeline Container */
.timeline-container {
  overflow: hidden;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  height: 300px;
}

/* Controls for Zoom Slider */
.controls {
  margin-bottom: 20px;
}

.controls label {
  margin-right: 10px;
  font-weight: bold;
}

.controls input[type="range"] {
  width: 200px;
}
</style>