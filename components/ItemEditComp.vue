<template>
    
    
    
    <!-- Od roku _____barva___horní část [X] _____ do roku  -->
    <div class="container">
        <UInput type="number" size="xl" model-value="1950" />
        <UCheckbox label="Label" />
        <UInput type="number" size="xl" model-value="2020" />
    </div>
    
    <!-- Hlavní část -->
    <UInput v-model="value" />
    <UTextarea autoresize placeholder="Popis hlavní události (období)" model-value="" />
    
    <!-- Secondary -->
    <UInput v-model="value" />
    <UTextarea autoresize placeholder="Popis Secondary" model-value="" />
    
    <!-- Detail -->
    <UInput v-model="value" />
    <UTextarea autoresize placeholder="Popis detailu" model-value="" />
    
    

    <UButton label="Ulozit zmeny"></UButton>
    <UButton label="Zahodit zmeny"></UButton>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>