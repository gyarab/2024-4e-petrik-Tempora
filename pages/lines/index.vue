<template>
    <div class="container_box">
    <div class="content_box h-5rem w-full mx-10">
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
        <h2>Lines hub page</h2>
        <p> Lines created: </p>
        
       
        <!--<button class="btn" @click="addTimeline"> Create new Line </button>--> 
        
        
        <NuxtLink class="btn" to="/lines/1">Goto timeline one (test)</NuxtLink>

        <!-- TODO -->
        <div v-for="l in lines">
            <LineCard :line="l" />
        </div>
    </div>
    </div>
</template>

<script setup>
import LineCard from '~/components/LineCard.vue';
//import { addTimeline } from '~/composables/supabase.js';

    // TODO
    const lines = null


</script>
    
<style  scoped>
   
</style>