<template>
    <div class="container_box">
        <div class="content_box">
            <h2>Register</h2>
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
            <button @click="signUp" class="btn mt-3">Register</button>
            
            <!-- Success and Error Messages -->
            <div v-if="successMsg" style="color: green;">{{ successMsg }}</div>
            <div v-if="errorMsg" style="color: red;">{{ errorMsg }}</div>

            <div class="mt-5">
                <NuxtLink to="/login" class="underline"> Already have an account? Login</NuxtLink>
            </div>
        </div>
    </div>
  </template>

<script setup>
    const client = useSupabaseClient()
    const email = ref("")
    const password = ref(null)
    const errorMsg = ref(null)
    const successMsg = ref(null)

    async function signUp(params) {
        try{
            const { data, error } = await client.auth.signUp({
                email: email.value,
                password: password.value,
            })
        
            if(error) throw error
        successMsg.value = "Zkontrolujte email pro aktivaci účtu"
        errorMsg.value = null
        }
        catch (error) {
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