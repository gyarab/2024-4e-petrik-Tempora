<template>
    <div class="container_box h-5rem">
        <div class="content_box h-full w-full mx-10 relative">
            <div class="absolute top-0 right-0">
                <button @click="toggleOff"> <Icon class="size-8" name="uil:multiply"></Icon> </button>
            </div>
            <p> Jméno osy: #####</p>
            <p> ID časové osy {{ id }}</p>
            <p> Autor: ####</p>
            <p> Vytvořeno: ##.##.####</p>
        </div>
    </div>
</template>

<script setup>
    import { toggleOff } from '../composables/state';
    import { useRoute } from 'vue-router';
    
    // Get route and user info
    const { id } = useRoute().params
</script>

<style scoped>

</style>