<template>
    <div class="mt-7 max-w-sm mx-auto text-center content_box ">
        <p class="mt-7 text-7xl font-bold"> {{ error.statusCode }}    </p>
        <p class="mt-7 text-6xl"> Ale ne, něco se pokazilo <Icon name="uil:sad-squint" /></p>
        <p class="mt-7"> {{ error.message }}</p>
        <button class="btn my-7" @click="handleClearError"> Zpět domů </button>
    </div>
</template>

<script setup>
    defineProps(['error'])

    const handleClearError = () => clearError({redirect: '/'})
</script>

<style scoped>

</style>