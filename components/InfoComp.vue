<template>
    
            <div class="absolute top-0 right-0">
                <button @click="toggleOff"> <Icon class="size-8" name="uil:multiply"></Icon> </button>
            </div>
            <p> Jméno osy: #####</p>
            <p> ID časové osy {{ id }}</p>
            <p> Autor: ####</p>
            <p> Vytvořeno: ##.##.####</p>
            <p> Popis: ####</p>
</template>

<script setup>
    import { toggleOff } from '../composables/state';
    import { useRoute } from 'vue-router';
    
    // Get route and user info
    const { id } = useRoute().params
</script>

<style scoped>

</style>