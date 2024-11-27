<template>
    <div class="card text-center">
        <p class="truncate font-bold"> {{ line.title }}</p>
        <NuxtLink :to="`/lines/${line.id}`"> 
           <p class="btn"> View Line </p>
           <p> {{ line.desc }} </p>
        </NuxtLink>
    </div>
</template>

<script setup>
const { line } = defineProps(['line'])
</script>

<style scoped>

</style>