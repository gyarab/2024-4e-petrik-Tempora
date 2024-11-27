<template>
    <div>       
        <h2>Home page</h2>
        <p>Welcome to site of interactive time </p>
        <p> Logout | Delete Account</p>
        <div> {{ data }}</div>
    </div>
</template>

<script setup>
    const { data } = await useFetch('/api/test?name=UserName')
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