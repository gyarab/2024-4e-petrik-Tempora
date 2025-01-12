<template>
    <div class="container_box">
      <div class="content_box w-96">
        <h2>Register</h2>
        
        <!-- Email Input -->
        <div class="mt-3">
          <label for="email">Email: </label>
          <UInput 
            icon="i-heroicons-envelope" 
            size="lg" 
            variant="none" 
            class="bg-white-black border-2 border-black rounded-lg w-full" 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
          />
        </div>
        
        <!-- Password Input -->
        <div class="mt-3">
          <label for="password">Password: </label>
          <UInput 
            size="lg" 
            variant="none" 
            class="bg-white-black border-2 border-black rounded-lg w-full" 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="Enter your password" 
          />
        </div>
        
        <!-- Nickname Input -->
        <div class="mt-3">
          <label for="nickname">Nickname: </label>
          <UInput 
            size="lg" 
            variant="none" 
            class="bg-white-black border-2 border-black rounded-lg w-full" 
            id="nickname" 
            v-model="nickname" 
            type="text" 
            placeholder="Choose a nickname" 
          />
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
          <NuxtLink to="/login">
            <p class="underline">Already have an account? Login</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const client = useSupabaseClient()
  const email = ref("")
  const password = ref("")
  const nickname = ref("") // Added nickname input
  const errorMsg = ref(null)
  const successMsg = ref(null)
  
  async function signUp() {
    try {
      // Sign up user with email and password
      const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value,
      })
  
      if (error) throw error
  
      // Insert nickname into user_profiles table if signup is successful
      if (data.user) {
        const { error: profileError } = await client
          .from('user_profiles') // Replace with your user profile table name
          .insert({
            id: data.user.id, // Use the user ID from the authentication system
            nickname: nickname.value,
          })
  
        if (profileError) throw profileError
      }
  
      successMsg.value = "Check your email to activate your account."
      errorMsg.value = null
    } catch (error) {
      errorMsg.value = error.message
      successMsg.value = null
    }
  }
  </script>
  
  <style scoped>
  </style>
  