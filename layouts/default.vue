<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold"> Tempora</NuxtLink>
                <ul class="flex gap-6">
                    <li><NuxtLink to="/"> Home </NuxtLink></li> 
                    <li><NuxtLink to="/about"> About </NuxtLink></li>  
                    <li><NuxtLink to="/lines"> Lines </NuxtLink></li> 
                        <li v-if="user"> 
                            <NuxtLink to="/" class="border-2 border-black rounded-xl px-4 py-2"> {{ user.email }} </NuxtLink> 
                        </li>
                        <li v-else>
                            <NuxtLink to="/login" class="border-2 border-black rounded-xl px-4 py-2"> Login </NuxtLink> 
                        </li>

                </ul>
            </nav>
        </header>

        <!-- Page -->
        <div class="container mx-auto p-4">
            <slot></slot>
        </div>

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
