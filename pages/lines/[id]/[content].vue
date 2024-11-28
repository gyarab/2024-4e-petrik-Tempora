<template>
    <div>
        <Head>
            <Title> Tempora | line {{ id }}</Title>
        </Head>
        
        
        <h2>Content page of line id: {{ id }} content: {{ content }}</h2>
        
        
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