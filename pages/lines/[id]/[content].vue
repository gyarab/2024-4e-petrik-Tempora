<template>
    <Head>
        <Title> Tempora | line {{ id }}</Title>
    </Head>
        
    <div class="container_box h-5rem" >
        <div class="content_box h-full w-full mx-10 relative"  
            :style="{ backgroundColor: backgroundColor }">
            
            <div class="absolute top-0 right-0">
                <NuxtLink :to="`/lines/${id}`"> <Icon class="size-8" name="uil:multiply"></Icon> </NuxtLink>
            </div>
            
            <div class="absolute bottom-0 right-1 text-xs">
                <p>line: {{ id }} id: {{ content }}</p>
            </div>

            <!-- Listen for emitted events -->
            <ItemEditComp v-if="inEdit" @update-background="updateBackgroundColor" />
            <ItemInfoComp v-if="!inEdit" @colorSelected="updateBackgroundColor" />
                
        
    
    
        </div>
    </div>



        
    
</template>

<script setup>
    import ItemEditComp from '~/components/ItemEditComp.vue';
    import ItemInfoComp from '~/components/ItemInfoComp.vue';
    import { inEdit } from '~/composables/state';

    const { id, content } = useRoute().params


    const backgroundColor = ref('#BAE6FD'); // Default color

    function updateBackgroundColor(newColor) {
    backgroundColor.value = newColor;
    }
    
    // Logika pro error page kdyz osa neexistuje
    if(!true)
    {
        throw createError({statusCode: 404, statusMessage: 'Obsah nebyl nalezen', fatal:true})
    }



</script>

<style  scoped>

</style>