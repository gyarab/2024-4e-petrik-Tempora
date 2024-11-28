<template>
    <div>
        <Head>
            <Title> Tempora | line {{ id }}</Title>
        </Head>
        
        
        <h2>Map page of timeline id: {{ id }}</h2>
        
    </div>
</template>

<script setup>
    const { id } = useRoute().params

    // Logika pro error page kdyz osa neexistuje
    if(!true)
    {
        throw createError({statusCode: 404, statusMessage: 'Osa nebyla nalezena', fatal:true})
    }


</script>

<style  scoped>

</style>