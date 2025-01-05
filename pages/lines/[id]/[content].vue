<template>
    
        <Head>
            <Title> Tempora | line {{ id }}</Title>
        </Head>
        
        
        
        
        
        


    <div class="container_box h-5rem" >
        <div class="content_box h-full w-full mx-10 relative">
            
            <div class="absolute top-0 right-0">
                <NuxtLink :to="`/lines/${id}`"> <Icon class="size-8" name="uil:multiply"></Icon> </NuxtLink>
            </div>
            
            <div class="text-center">
                <h2>Content page of line id: {{ id }} content: {{ content }}</h2>
            </div>
        
    
    
        </div>
    </div>



        
    
</template>

<script setup>
    const { id, content } = useRoute().params

    // Logika pro error page kdyz osa neexistuje
    if(!true)
    {
        throw createError({statusCode: 404, statusMessage: 'Obsah nebyl nalezen', fatal:true})
    }


</script>

<style  scoped>

</style>