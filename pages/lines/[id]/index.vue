<template>
  <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
  
    <Sidebar/>
    
    <div :style="{'marginLeft': sidebarWidth}">
      <div v-if="!inInfo && !inSettings"> <Timeline/> </div>
      <div v-if="inInfo"> <InfoComp></InfoComp> </div>
      <div v-if="inSettings"> <SettingsComp></SettingsComp> </div>
    </div>
    


  
</template>

<script setup>

import Timeline from '~/components/TimelineComp.vue';
import Sidebar from '~/components/SidebarComp.vue';
import InfoComp from '~/components/InfoComp.vue';
import { useRoute } from 'vue-router';
import { inEdit, inInfo, inSettings, sidebarWidth } from '~/components/state';

    // Get route and user info
    const { id } = useRoute().params


// Error handling for invalid timelines
if (!true) {
  throw createError({ statusCode: 404, statusMessage: 'Timeline not found', fatal: false });
}
</script>

<style scoped>
</style>