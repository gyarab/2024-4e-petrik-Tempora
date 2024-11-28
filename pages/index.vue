<template>
    <div> 
        <h2>Home page</h2>
        <p>Welcome to the interactive timeline site</p>
        <div v-if="user">
            <p>Logged in as: <span class="underline">{{ user.email }}</span></p>
            <button @click="logout" class="btn mt-3">Logout</button>
        </div>
        <div v-else>
            <p>You are browsing as a <span class="underline font-bold"> Guest</span>.
            <router-link to="/login" class="btn mt-3">Login</router-link> </p>
        </div>
        <button class="btn" @click="toggleDarkMode">
            Toggle Dark Mode
        </button>
        

        <!-- api response test   <div>{{ data }}</div>-->
    </div>
</template>

<script setup>
    //const { data } = await useFetch('/api/test?name=UserName')

    const user = useSupabaseUser()
    const router = useRouter()
    const client = useSupabaseClient()

    async function logout(params) {

        try {
            const { error } = await client.auth.signOut()
            if(error) throw error
            router.push("/login")
        } catch (error) {
         console.log(error.message)   
        }
    }


    // Toggle dark mode
function toggleDarkMode() {
  const html = document.documentElement;
  html.classList.toggle("dark");
}



</script>

<style  scoped>
    
</style>