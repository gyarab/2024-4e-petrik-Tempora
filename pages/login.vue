<template>
    <div class="container_box ">
      <div class="content_box w-96">
        <h2>Přihlášení</h2>
        <!-- Email Input -->
            <div class="mt-3">
                <label for="email">Email: </label>
                <UInput icon="i-heroicons-envelope" size="lg" variant="none" class="bg-white-black border-2 border-black rounded-lg  w-full" 
                        id="email" v-model="email" type="email" placeholder="Zadejte váš email" />
            </div>
            
            <!-- Password Input -->
            <div class="mt-3">
                <label for="password"> Heslo: </label>
                <UInput size="lg" variant="none" class="bg-white-black border-2 border-black rounded-lg  w-full" 
                        id="password" v-model="password" type="password" placeholder="Zadejte vaše heslo" />
            </div>
            
            <!-- Submit Button -->
            <button @click="signIn" class="btn mt-3">Přihlásit se</button>
            
             <!-- Message Container -->
             <div class="message-box">
                <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
            </div>

            <!-- Redirect to register -->
            <div class="mt-5">
                <NuxtLink to="/register"> <p >Ještě nemáte účet? <span class="underline"> Registrujte se</span></p> </NuxtLink>
            </div>
                
        </div>
    </div>
</template>

<script setup>
    const router = useRouter()
    const client = useSupabaseClient()
    
    const email = ref("")
    const password = ref(null)
    const errorMsg = ref(null)

    async function signIn(params) {
        try {
            const { error } = await client.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })
            if(error) throw error
            router.push("/")
        } catch (error) {
            errorMsg.value = error.message
        }
    }
</script>

<style  scoped>
    
</style>