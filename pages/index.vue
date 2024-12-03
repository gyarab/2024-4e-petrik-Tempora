<template>
    <div class="container_box ">
        <div class="content_box h-top w-full mx-10" > 
            <h2>Home page</h2>
            <p>Welcome to the interactive timeline site</p>
            <div v-if="user">
                <p>Logged in as: <span class="underline">{{ user.email }}</span></p>
                <button @click="logout" class="btn">Logout</button>
            </div>
            <div v-else>
                <p>You are browsing as a <span class="underline font-bold"> Guest</span>. </p>
                <button class="btn"> <router-link to="/login" >Login</router-link> </button>  
            </div>
            <button class="btn" @click="toggleDarkMode">
                Toggle Dark Mode  
            </button>
        </div>
        

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