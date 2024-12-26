<template>
  <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
  
    
  <div class="flex">

    <Sidebar></Sidebar>
    <main class="flex-1 ml-24 p-4">
    
    
    
    <h2>Timeline Page (ID: {{ id }})</h2>




    <div v-if="user">
      <NuxtLink :to="`${id}/edit`">Edit Timeline</NuxtLink>
    </div>

    <TimelineComponent/>
  </main>
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
</style>