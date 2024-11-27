<template>
    <div>
        <Head>
            <Title> Tempora | lines</Title>
        </Head>
        
        
        <h2>Lines hub page</h2>
        <p> Lines created: </p>
        <span class="btn"> Create new Line </span> 

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
    h2{
        font-size: 36px;
        margin-bottom: 20px;
    }
    p{
        margin: 20px 0;
    }
</style>