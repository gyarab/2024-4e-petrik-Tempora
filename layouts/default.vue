<template>
    <header class="topbar fixed w-full z-50">
        <nav class="container mx-auto p-4 flex justify-between items-center">
            <NuxtLink to="/" class="font-bold text-2xl"> Tempora</NuxtLink>
            <ul class="hidden md:flex gap-6 items-center">
                <li><NuxtLink to="/"> Home </NuxtLink></li> 
                <li><NuxtLink to="/about"> About </NuxtLink></li>  
                <li><NuxtLink to="/lines"> Lines </NuxtLink></li> 
                <li v-if="user"> 
                    <NuxtLink to="/" class="tb-border"> {{ nickname }} </NuxtLink> 
                </li>
                <li v-else>
                    <NuxtLink to="/login" class="tb-border"> Login </NuxtLink> 
                </li>
            </ul>
            <!-- Mobile menu button -->
            <button class="md:hidden">
                <Icon name="uil:bars" class="size-8"/>
            </button>
        </nav>
    </header>

    <!-- Add top margin to main content -->
    <div class="pt-16">
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
    import { fetchNickname } from '~/composables/useSupabase';
    
    const user = useSupabaseUser()
    const nickname = ref('')

    
  
    onMounted(async () => {
    if (user.value) {
        nickname.value = (await fetchNickname(user.value)) || user.value.email.split('@')[0]
        }
    })
</script>
