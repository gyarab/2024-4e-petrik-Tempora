<template>
  <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
  
    <Sidebar/>
    
    <div :style="{'marginLeft': sidebarWidth}">
      <div v-if="!inInfo && !inSettings"> 
        <Timeline/> 
      </div>
    </div>
      
    <div v-if="inInfo" :style="{'marginLeft': sidebarWidth}"> 
      <div class="container_box h-5rem">
        <div class="content_box h-full w-full mx-10 relative">
          <InfoComp></InfoComp> 
        </div>
      </div>
    </div>
      
    <div v-if="inSettings" :style="{'marginLeft': sidebarWidth}"> 
      <div class="container_box h-5rem">
        <div class="content_box h-full w-full mx-10 relative">
          <SettingsComp></SettingsComp>
        </div>
      </div>
    </div>
    


  
</template>

<script setup>

import Timeline from '~/components/TimelineComp.vue';
import Sidebar from '~/components/SidebarComp.vue';
import InfoComp from '~/components/InfoComp.vue';
import { useRoute } from 'vue-router';
import { inEdit, inInfo, inSettings, sidebarWidth } from '~/composables/state';

    // Get route and user info
    const { id } = useRoute().params


// Error handling for invalid timelines
if (!true) {
  throw createError({ statusCode: 404, statusMessage: 'Timeline not found', fatal: false });
}
</script>

<style scoped>
</style>