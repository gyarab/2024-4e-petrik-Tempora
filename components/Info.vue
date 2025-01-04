<template>
    <div>
        <p class="text-white">line ID: {{ id }}</p>
    </div>
</template>

<script>
    import { useRoute } from 'vue-router';
    
    // Get route and user info
    const { id } = useRoute().params
</script>

<style scoped>

</style>