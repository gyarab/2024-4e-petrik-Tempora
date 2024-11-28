<template>
    <div class="content_box h-top">
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
        <h2>Lines hub page</h2>
        <p> Lines created: </p>
        <span class="btn"> Create new Line </span> 
        <button class="btn"> <NuxtLink to="/lines/1">Goto timeline one</NuxtLink> </button>

        <!-- TODO -->
        <div v-for="l in lines">
            <LineCard :line="l" />
        </div>
    </div>
</template>

<script setup>
import LineCard from '~/components/LineCard.vue';

    // TODO
    const lines = null


</script>
    
<style  scoped>
   
</style>