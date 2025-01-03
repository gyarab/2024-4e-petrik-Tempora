<template>
    <div class="sidebar fixed white-black top-0 left-0 h-screen w-16  
                flex flex-col shadow-lg bg-sky-950 " 
                
                :style="{width: sidebarWidth}"> 
                <span class="" @click="toggleSidebar"><Icon class=" sidebar-icon size-12" name="material-symbols:menu-rounded" /> </span>
                <div v-if="!collapsed">
                <Icon class=" sidebar-icon" name="material-symbols:share" />
                <Icon class=" sidebar-icon" name="material-symbols:settings" />
                <Icon class=" sidebar-icon" name="material-symbols:info" />
                <Icon v-if="user" class=" sidebar-icon" name="material-symbols:edit-square-outline-rounded" />


                <p class="text-white">line ID: {{ id }}</p>
                </div>
                
        
    </div>
</template>

<script setup>
    import { useRoute} from 'vue-router';

    // Get route and user info
    const { id } = useRoute().params
    const user = useSupabaseUser()

    const editMode = false;

    import { collapsed, toggleSidebar, sidebarWidth } from './state';

</script>

<style scoped>

</style>