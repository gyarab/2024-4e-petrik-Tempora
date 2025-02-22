<template>
  <Head>
    <Title> Tempora | Timeline {{ id }}</Title>
  </Head>
  
    <Sidebar @info-toggle="handleInfoToggle" @settings-toggle="handleSettingsToggle"/>
    
    <div :style="{'marginRight': sidebarWidth}">
      <div v-if="!inInfo && !inSettings"> 
        <Timeline/> 
      </div>
    </div>
      
    <div v-if="inInfo" :style="{'marginRight': sidebarWidth}"> 
      <div class="container_box h-5rem">
        <div class="content_box h-full w-full mx-10 relative">
          <InfoComp :lineId="selectedLineId"></InfoComp> 
        </div>
      </div>
    </div>
      
    <div v-if="inSettings" :style="{'marginRight': sidebarWidth}"> 
      <div class="container_box h-5rem">
        <div class="content_box h-full w-full mx-10 relative">
          <SettingsComp :lineId="selectedLineId"></SettingsComp>
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

    const selectedLineId = ref(null);

function handleInfoToggle() {
  selectedLineId.value = Number(id);
  toggleInfo();
}

function handleSettingsToggle() {
  selectedLineId.value = Number(id);
  toggleSettings();
}



</script>

<style scoped>
</style>