<template>
    <div class="sidebar fixed white-black top-0 left-0 h-screen
                flex flex-col shadow-lg bg-sky-950 transition-all duration-100 ease-in-out" 
                
                :style="{width: sidebarWidth}"> 
                <span class="" @click="toggleSidebar"><Icon class=" sidebar-icon size-12" name="material-symbols:menu-rounded" /> </span>
                <Transition name="fade">
                    <div v-if="!collapsed" class="space-y-8 mt-8">
                    <Icon class=" sidebar-icon" name="material-symbols:share" />
                    <Icon class=" sidebar-icon" name="material-symbols:settings" />
                    <Icon class=" sidebar-icon" name="material-symbols:info" />
                    <Icon v-if="user" class=" sidebar-icon" name="material-symbols:edit-square-outline-rounded" />
                    

                    <p class="text-white">line ID: {{ id }}</p>
                    </div>
                </Transition>
        
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

<style>
   /* Define the fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.05s ease-in-out; /* Adjust duration as needed */
}

.fade-enter-from, .fade-leave-to {
  opacity: 0; /* Start/End state for fade */
}
</style>