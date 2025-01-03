<template>
  <Head>
      <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
  
    
  <div class="flex">

    <Sidebar></Sidebar>
    <main class="flex-1 ml-24 p-4">

    <TimelineComponent/>



    

    
  </main>
  </div>
</template>

<script setup>

import TimelineComponent from '~/components/TimelineComponent.vue';



// Error handling for invalid timelines
if (!true) {
  throw createError({ statusCode: 404, statusMessage: 'Timeline not found', fatal: false });
}
</script>

<style scoped>
</style>