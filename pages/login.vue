<template>
    <div class="container_box ">
      <div class="content_box">
        <h2>Login</h2>
        <!-- Email Input -->
            <div class="mt-3">
                <label for="email">Email: </label>
                <input class="input" id="email" v-model="email" type="email" placeholder="Enter your email" />
            </div>
            
            <!-- Password Input -->
            <div class="mt-3">
                <label for="password">Password: </label>
                <input class="input" id="password" v-model="password" type="password" placeholder="Enter your password" />
            </div>
            
            <!-- Submit Button -->
            <button @click="signIn" class="btn mt-3">Login</button>
            
            <!-- Success and Error Messages -->
            <div v-if="errorMsg" style="color: red;">{{ errorMsg }}</div>
                <div class="mt-5">
                <NuxtLink to="/register" class="underline"> Dont have account yet? Register </NuxtLink>
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
    h2{
        font-size: 36px;
        margin-bottom: 20px;
    }
    p{
        margin: 20px 0;
    }
</style>