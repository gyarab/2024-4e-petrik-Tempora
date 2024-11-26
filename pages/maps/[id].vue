<template>
    <div>
        <h2>Map page of {{ id }}</h2>
        <p>Welcome to site of interactive time </p>
    </div>
</template>

<script setup>
    const { id } = useRoute().params
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