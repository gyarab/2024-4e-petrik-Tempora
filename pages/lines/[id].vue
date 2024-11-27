<template>
    <div>
        <Head>
            <Title> Tempora | line {{ id }}</Title>
        </Head>
        
        
        <h2>Map page of {{ id }}</h2>
        <p>Welcome to site of interactive time </p>
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
    h2{
        font-size: 36px;
        margin-bottom: 20px;
    }
    p{
        margin: 20px 0;
    }
</style>