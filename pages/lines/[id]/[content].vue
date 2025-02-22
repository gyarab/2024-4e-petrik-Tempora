<template>
    <Head>
        <Title> Tempora | Timeline {{ id }}</Title>
    </Head>
        
    <div class="container_box" >
        <div class="content_box h-full w-full mx-10 px-4 md:px-6 relative "  
            :style="{ backgroundColor: backgroundColor }">
            
            <div class="absolute top-0 right-0 text-black"  >
                <NuxtLink :to="`/lines/${id}`"> <Icon class="size-8" name="uil:multiply"></Icon> </NuxtLink>
            </div>
            
            <!-- For debugging
            <div class="absolute bottom-0 right-1 text-xs">
                <p>line: {{ id }} id: {{ content }}</p>
            </div>
            -->

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



</script>

<style  scoped>

</style>