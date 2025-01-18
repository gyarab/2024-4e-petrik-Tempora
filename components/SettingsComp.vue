<template>
    
            <div class="absolute top-0 right-0">
                <button @click="toggleOff"> <Icon class="size-8" name="uil:multiply"></Icon> </button>
            </div>


            <div class="mt-3">
                <label> "jmeno osy" </label>
                <input class="input" id="" placeholder="Změnit jméno" />
            </div>
            
            <p> ID časové osy {{ id }}</p>
            <p> Autor: ####</p>
            <p> Začátek a konec časové osy</p>
            <p> Jména jednotlivých řádků </p>


            <button> Uložit nastavení </button>
       
</template>

<script setup>
    import { useRoute } from 'vue-router';
    import { toggleOff } from '../composables/state';
    
    // Get route and user info
    const { id } = useRoute().params
</script>

<style scoped>

</style>