<template>
    <div class="fixed white-black top-16 left-0 h-screen w-24  
                flex flex-col shadow-lg bg-sky-950"> 
                <Icon class=" sidebar-icon" name="material-symbols:settings" />
                <Icon class=" sidebar-icon" name="material-symbols:settings" />
                <Icon class=" sidebar-icon" name="material-symbols:settings" />
                <Icon class=" sidebar-icon" name="material-symbols:settings" />
                
        <div v-if="user">
            <NuxtLink :to="`${id}/edit`">Edit Timeline</NuxtLink>
        </div>
        <h1>Timeline Page (ID: {{ id }})</h1>
    </div>
    
</template>

<script setup>
    import { useRoute } from 'vue-router';

    // Get route and user info
    const { id } = useRoute().params
    const user = useSupabaseUser()

</script>

<style scoped>
    
</style>