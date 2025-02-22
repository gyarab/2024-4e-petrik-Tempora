<template>
     <Head>
        <Title> Tempora | Register</Title>
    </Head>
    <div class="container_box">
      <div class="content_box w-96">
        <h2>Registrace</h2>
        
        <!-- Email Input -->
        <div class="mt-3">
          <div class="flex items-center gap-2">
            <label for="email">Email: </label>
          </div>
          <UInput 
            icon="i-heroicons-envelope" 
            size="lg" 
            variant="none" 
            class="bg-white-black border-2 border-black rounded-lg w-full" 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="Zadejte váš email" 
          />
        </div>
        
        <!-- Password Input -->
        <div class="mt-3">
          <div class="flex items-center gap-2">
            <label for="password">Heslo: </label>
            <UTooltip text="Heslo musí obsahovat alespoň 6 znaků">
              <Icon name="i-heroicons-question-mark-circle" style="color: black" class="size-5"  />
            </UTooltip>
          </div>
          <UInput 
            size="lg" 
            variant="none" 
            class="bg-white-black border-2 border-black rounded-lg w-full" 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="Zadejte heslo" 
          />
        </div>
        
        <!-- Nickname Input -->
        <div class="mt-3">
          <div class="flex items-center gap-2">
            <label for="nickname">Uživatelské jméno: </label>
            
            <UTooltip text="Uživatelské jméno může mít maximálně 32 znaků">
              <Icon name="i-heroicons-question-mark-circle" style="color: black" class="size-5"  />
            </UTooltip>
          </div>
          <UInput 
            size="lg" 
            variant="none" 
            class="bg-white-black border-2 border-black rounded-lg w-full" 
            id="nickname" 
            v-model="nickname" 
            type="text" 
            placeholder="Zadejte uživatelské jméno" 
          />
        </div>
        
        <!-- Submit Button -->
        <button @click="signUp" class="btn mt-3">Registrovat se</button>
        
        <!-- Message Container -->
        <div class="message-box">
          <div v-if="successMsg" class="success">{{ successMsg }}</div>
          <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
        </div>
        
        <!-- Redirect to login -->
        <div class="mt-5">
          <NuxtLink to="/login">
            <p>Už máte účet? <span  class="underline"> Přihlašte se </span></p>
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
    if (nickname.value.length > 32) {
        errorMsg.value = "Uživatelské jméno nesmí být delší než 32 znaků"
        successMsg.value = null
        return
    }

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
                .from('user_profiles')
                .insert({
                    id: data.user.id,
                    nickname: nickname.value,
                })

            if (profileError) {
                if (profileError.message.includes('user_profiles_nickname_check')) {
                    throw new Error('Uživatelské jméno nesmí být delší než 32 znaků')
                }
                throw profileError
            }
        }

        successMsg.value = "Zkontrolujte email pro aktivaci účtu."
        errorMsg.value = null
    } catch (error) {
        errorMsg.value = error.message
        successMsg.value = null
    }
  }
  </script>
  
  <style scoped>
  </style>
