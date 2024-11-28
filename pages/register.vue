<template>
    <div class="container_box">
        <div class="content_box w-96">
            <h2>Register</h2>
            <!-- Email Input -->
            <div class="mt-3">
                <label for="email">Email: <br></label>
                <input class="input" id="email" v-model="email" type="email" placeholder="Enter your email" />
            </div>
            
            <!-- Password Input -->
            <div class="mt-3">
                <label for="password">Password: <br></label>
                <input class="input" id="password" v-model="password" type="password" placeholder="Enter your password" />
            </div>
            
            <!-- Submit Button -->
            <button @click="signUp" class="btn mt-3">Register</button>

            <!-- Message Container -->
            <div class="message-box">
                <div v-if="successMsg" class="success">{{ successMsg }}</div>
                <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
            </div>

            
            <!-- Redirect to login -->
            <div class="mt-5">
                <NuxtLink to="/login"> <p class="underline"> Already have an account? Login </p> </NuxtLink>
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
            successMsg.value = null
        }
    }
</script>

<style  scoped>
    
</style>