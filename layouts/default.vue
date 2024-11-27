<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold"> Tempora</NuxtLink>
                <ul class="flex gap-6">
                    <li><NuxtLink to="/"> Home </NuxtLink></li> 
                    <li><NuxtLink to="/about"> About </NuxtLink></li>  
                    <li><NuxtLink to="/lines" class="btn"> Lines </NuxtLink></li> 
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
