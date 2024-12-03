<template>
        <header class="topbar">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold text-2xl"> Tempora</NuxtLink>
                <ul class="flex gap-6">
                    <li><NuxtLink to="/"> Home </NuxtLink></li> 
                    <li><NuxtLink to="/about"> About </NuxtLink></li>  
                    <li><NuxtLink to="/lines"> Lines </NuxtLink></li> 
                    <li v-if="user"> 
                        <NuxtLink to="/" class="tb-border"> {{ user.email.split('@')[0] }} </NuxtLink> 
                    </li>
                    <li v-else>
                        <NuxtLink to="/login" class="tb-border"> Login </NuxtLink> 
                    </li>
                </ul>
            </nav>
        </header>

        <!-- Page -->
        <div class="pt-4 ">
            <slot></slot>
        </div> 
</template>

<style>
    .router-link-exact-active
    {
        font-weight: bolder;
    }
</style>

<script setup>
    const user = useSupabaseUser()
</script>
