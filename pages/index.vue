<template>
    <div class="container_box ">
        <div class="content_box h-5rem w-full mx-10" > 
            <h2>Home page</h2>
            <p>Welcome to the interactive timeline site</p>
            <div v-if="user">
                <p>Logged in as: <span class="underline">{{ user.email }}</span></p>
                <p>
                    Nickname: <span v-if="nickname">{{ nickname }}</span>
                    <span v-else class="italic text-gray-500">Not set</span>
                </p>
                <div>
                    <input
                        v-model="newNickname"
                        type="text"
                        placeholder="Change your nickname"
                        class="border rounded p-2"
                    />
                    <button @click="changeNickname" class="btn ml-2">Save</button>
                </div>
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
    import { fetchNickname, updateNickname } from "~/composables/useSupabase";

    const user = useSupabaseUser()
    const router = useRouter()
    const client = useSupabaseClient()

    const newNickname = ref("");
    const nickname = ref("");
    
    async function logout() {
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
  console.log(`Dark mode is ${html.classList.contains("dark") ? "enabled" : "disabled"}`);
}

watchEffect(async () => {
        if (user.value) {
            nickname.value = await fetchNickname(user.value) || user.value.email.split('@')[0];
        }
    });

// Change nickname
async function changeNickname() {
    try {
        if (!newNickname.value.trim()) {
            alert("Nickname cannot be empty!");
            return;
        }
        const success = await updateNickname(user.value.id, newNickname.value.trim());
        if (success) {
            nickname.value = newNickname.value.trim();
            newNickname.value = "";
            alert("Nickname updated successfully!");
        } else {
            alert("Failed to update nickname. Please try again.");
        }
    } catch (error) {
        console.error(error.message);
    }
}



</script>

<style  scoped>
    
</style>