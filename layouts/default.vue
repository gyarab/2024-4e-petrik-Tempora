<template>
    <header class="backdrop-blur-sm fixed w-full z-50 bg-white dark:bg-zinc-900 shadow-md h-16">
        <nav class="container mx-auto h-full">
            <div class="flex justify-between items-center h-full px-4">
                <NuxtLink to="/" class="font-bold text-2xl hover:text-sky-700 dark:hover:text-sky-300 transition-colors"> 
                    Tempora
                </NuxtLink>
                
                <!-- Desktop Menu -->
                <ul class="hidden md:flex gap-6 items-center">
                    <li v-for="item in menuItems" :key="item.path">
                        <NuxtLink 
                            :to="item.path" 
                            class="hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </li>
                    <li v-if="user"> 
                        <NuxtLink to="/" class="rounded-md border-black dark:border-white border-2 p-2"> 
                            {{ nickname || 'Profile' }}
                        </NuxtLink> 
                    </li>
                    <li v-else>
                        <NuxtLink to="/login" class="rounded-md border-black dark:border-white border-2 p-2"> 
                            Přihlášení 
                        </NuxtLink> 
                    </li>
                </ul>

                <!-- Mobile Menu Button -->
                <UButton
                    class="md:hidden flex items-center justify-center skyButton h-10 w-10"
                    :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
                    @click="toggleMenu"
                >
                    <Icon :name="isMenuOpen ? 'uil:times' : 'uil:bars'" class="size-5"/>
                </UButton>
            </div>

            <!-- Mobile Menu Panel -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform -translate-y-4 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform -translate-y-4 opacity-0"
            >
                <div v-show="isMenuOpen" 
                     class="md:hidden absolute right-4 top-16 w-48 bg-white dark:bg-zinc-800 shadow-lg rounded-lg border dark:border-zinc-700">
                    <ul class="flex flex-col items-stretch p-2 gap-2">
                        <li v-for="item in menuItems" :key="item.path">
                            <NuxtLink 
                                :to="item.path"
                                class="block py-2 px-4 rounded-md hover:bg-sky-100 dark:hover:bg-zinc-700 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                                @click="isMenuOpen = false"
                            >
                                {{ item.label }}
                            </NuxtLink>
                        </li>
                        <li v-if="user" class="px-2"> 
                            <UTooltip v-if="nickname && nickname.length > 16" :text="nickname">
                                <NuxtLink to="/" class="rounded-md dark:border-white border-black border-2 p-2 block text-center"> 
                                    {{ truncatedNickname }} 
                                </NuxtLink> 
                            </UTooltip>
                            <NuxtLink v-else to="/" class="rounded-md dark:border-white border-black border-2 p-2 block text-center"> 
                                {{ nickname || 'Profile' }} 
                            </NuxtLink> 
                        </li>
                        <li v-else class="px-2">
                            <NuxtLink to="/login" class="rounded-md dark:border-white border-black border-2 p-2 block text-center"> 
                                Přihlášení 
                            </NuxtLink> 
                        </li>
                    </ul>
                </div>
            </Transition>
        </nav>
    </header>

    <main class="pt-16 min-h-screen">
        <slot></slot>
    </main>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { fetchNickname } from '~/composables/useSupabase'
import { toggleOff } from '~/composables/state'

const user = useSupabaseUser()
const nickname = ref('')
const isMenuOpen = ref(false)

const menuItems = [
    { path: '/', label: 'Uživatel' },
    { path: '/lines', label: 'Přehled os' },
    { path: '/about', label: 'O projektu' }
]

const truncatedNickname = computed(() => {
    if (!nickname.value) return 'Profile'
    return nickname.value.length > 16 
        ? `${nickname.value.substring(0, 13)}...` 
        : nickname.value
})

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

// Close mobile menu and reset state on route change
watch(useRoute(), () => {
    isMenuOpen.value = false
    toggleOff() // Add this line to reset state when route changes
})

watchEffect(async () => {
    if (user.value) {
        nickname.value = await fetchNickname(user.value) || user.value.email.split('@')[0]
    }
})
</script>

<style scoped>

.router-link-exact-active {
    @apply font-bold text-sky-700 dark:text-sky-300;
}

</style>
