<template>
    <div class="container_box">
        <div class="content_box w-full mx-10">
            <h1 class="text-3xl font-bold mb-6 text-sky-700 dark:text-sky-300">
                Vítejte v aplikaci Tempora
            </h1>
            
            <div v-if="user" class="space-y-6">
                <!-- Account Info Section -->
                <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border-2 border-black w-full lg:w-1/2">
                    <h2 class="text-xl font-semibold mb-4">Informace o účtu</h2>
                    <div class="space-y-3">
                        <p class="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-8">
                            <span class="black-white">Email:</span>
                            <span class="font-medium black-white">{{ user.email }}</span>
                        </p>
                        <p class="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-8">
                            <span class="black-white">Uživatelské jméno:</span>
                            <span v-if="nickname" class="font-medium black-white">{{ nickname }}</span>
                            <span v-else class="italic text-gray-500">Nenastaveno</span>
                        </p>
                    </div>
                    
                    <div class="mt-4">
                        <UInput
                            color="sky"
                            v-model="newNickname"
                            placeholder="Nové jméno"
                            :ui="{ icon: { trailing: { pointer: '' } } }"
                        >
                            <template #trailing>
                                <UButton 
                                    @click="changeNickname"
                                    label="Uložit"
                                    class="right-0 absolute !bg-sky-700 hover:!bg-sky-600 dark:!bg-sky-300 dark:hover:!bg-sky-400"
                                    :loading="isChangingNickname"
                                />
                            </template>
                        </UInput>
                    </div>
                </div>

                <!-- Settings -->
                <div class="flex gap-4 justify-between">
                    <div class="flex gap-4">
                        <UButton 
                            @click="logout" 
                            class="skyButton"
                            label="Odhlásit se"
                            :loading="isLoggingOut"
                        />
                        <UButton
                            @click="toggleDarkMode"
                            class="skyButton"
                            :label="isDark ? 'Světlý režim' : 'Tmavý režim'"
                            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                        />
                    </div>
                </div>
            </div>

            <!-- Guest View -->
            <div v-else class="space-y-6">
                <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border-2 border-black">
                    <div class="text-center space-y-4">
                        <p class="text-lg black-white">
                            Prohlížíte jako <span class="font-bold">Host</span>
                        </p>
                        <p>
                            Můžete pouze prohlížet veřejné časové osy, pro více možností se přihlašte.
                        </p>
                        <div class="flex justify-center gap-4">
                            <UButton to="/login" label="Přihlásit se" class="skyButton" />
                            <UButton to="/register" label="Registrovat se" class="skyButton" />
                        </div>
                    </div>
                </div>

                <!-- Theme Toggle for Guests -->
                <div class="flex justify-end">
                    <UButton
                        @click="toggleDarkMode"
                        class="skyButton"
                        :label="isDark ? 'Světlý režim' : 'Tmavý režim'"
                        :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                        
                    />
                </div>
            </div>
        </div>
        <UNotifications/>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { fetchNickname, updateNickname } from "~/composables/useSupabase"

const user = useSupabaseUser()
const router = useRouter()
const client = useSupabaseClient()
const colorMode = useColorMode()
const toast = useToast()

const newNickname = ref("")
const nickname = ref("")
const isLoggingOut = ref(false)
const isChangingNickname = ref(false)

const isDark = computed(() => colorMode.value === 'dark')

async function logout() {
    isLoggingOut.value = true
    try {
        const { error } = await client.auth.signOut()
        if(error) throw error
        router.push("/login")
    } catch (error) {
        console.error(error.message)
    } finally {
        isLoggingOut.value = false
    }
}

function toggleDarkMode() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

async function changeNickname() {
    if (!newNickname.value.trim()) {
        toast.add({
            title: 'Chyba',
            description: 'Přezdívka nemůže být prázdná',
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            timeout: 3000
        })
        return
    }

    if (newNickname.value.trim().length > 32) {
        toast.add({
            title: 'Chyba',
            description: 'Přezdívka nesmí být delší než 32 znaků',
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            timeout: 3000
        })
        return
    }

    isChangingNickname.value = true
    try {
        await updateNickname(user.value.id, newNickname.value.trim())
        nickname.value = newNickname.value.trim()
        newNickname.value = ""
        toast.add({
            title: 'Úspěch',
            description: 'Přezdívka byla úspěšně změněna',
            icon: 'i-heroicons-check-circle',
            color: 'green',
            timeout: 3000
        })
    } catch (error) {
        toast.add({
            title: 'Chyba',
            description: error.message || 'Nepodařilo se změnit přezdívku',
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            timeout: 3000
        })
    } finally {
        isChangingNickname.value = false
    }
}

watchEffect(async () => {
    if (user.value) {
        nickname.value = await fetchNickname(user.value) || user.value.email.split('@')[0]
    }
})
</script>