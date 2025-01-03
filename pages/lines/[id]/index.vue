<template>
  <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
  
    
  <div class="flex">

    <Sidebar></Sidebar>
    <main class="flex-1 ml-24 pl-4 px-2">

    <TimelineComponent/>

  </main>
  </div>
</template>

<script setup>

import TimelineComponent from '~/components/TimelineComponent.vue';
import { useRoute } from 'vue-router';

    // Get route and user info
    const { id } = useRoute().params


// Error handling for invalid timelines
if (!true) {
  throw createError({ statusCode: 404, statusMessage: 'Timeline not found', fatal: false });
}
</script>

<style scoped>
</style>