<template>
  <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
  
    <Sidebar></Sidebar>
    
    <div :style="{'marginLeft': sidebarWidth}">
      <TimelineComponent/>
    </div>
    


  
</template>

<script setup>

import TimelineComponent from '~/components/TimelineComponent.vue';
import { useRoute } from 'vue-router';
import { sidebarWidth } from '~/components/state';

    // Get route and user info
    const { id } = useRoute().params


// Error handling for invalid timelines
if (!true) {
  throw createError({ statusCode: 404, statusMessage: 'Timeline not found', fatal: false });
}
</script>

<style scoped>
</style>