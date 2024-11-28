<template>
    <div>
        <Head>
            <Title> Tempora | line {{ id }}</Title>
        </Head>
        
        
        <h2>Map page of timeline id: {{ id }}</h2>
        <div v-if="user">
            <NuxtLink :to="`${id}/edit`">  <p> Edit this line </p> </NuxtLink>
        </div>
        
        
    </div>
</template>

<script setup>
    const { id } = useRoute().params
    const user = useSupabaseUser()

    // Logika pro error page kdyz osa neexistuje
    if(!true)
    {
        throw createError({statusCode: 404, statusMessage: 'Osa nebyla nalezena', fatal:true})
    }


</script>

<style  scoped>

</style>