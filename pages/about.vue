<template>
    <Head>
        <Title> Tempora | About</Title>
    </Head>

    <div class="container_box" >
        <div class="content_box h-full w-full mx-10">
            <div class="text-3xl font-bold mb-6 text-sky-700 dark:text-sky-300">
                <h2> O projektu Tempora</h2>
            </div>
         

        <!-- O projektu -->
        <div class="bg-white dark:bg-zinc-800 p-4 rounded-lg border-2 border-black">
            <p>Tempora je univerzální nástroj pro tvorbu interaktivních časových os, který umožňuje vizualizovat historické události, osobnosti a kontexty v širších souvislostech. Hlavním cílem projektu je usnadnit organizaci a porozumění historickým a tematickým souvislostem prostřednictvím intuitivního rozhraní.</p>  
            <br>
            <p>Klíčové vlastnosti:</p>
            <ul class="list-disc ml-5">
                <li><span class="font-bold">Interaktivní prvky</span> - Události, osobnosti a historické směry lze snadno prozkoumávat a zobrazovat v detailním kontextu.</li>
                <li><span class="font-bold">Flexibilita</span> - Možnost vytvářet a upravovat vlastní časové osy s přizpůsobitelnými prvky.</li>
                <li><span class="font-bold">Moderní technologie</span> - Tempora je postavena na Nuxt.js pro frontend a Supabase jako backendovou databázi.</li>
            </ul>

            <p class="mt-4"> Více informací o používání a celém projektu najdete na GitHubu nebo v dokumentaci.</p>
           
        </div>  

        

        <!-- Odkazy -->
        <div class="mt-6 flex">
            <a
            href="https://github.com/gyarab/2024-4e-petrik-Tempora"
            target="_blank"
            class="icon-style"
            >
            <div>
                <span>
                <Icon class="size-16 text-gray-950 " name="uil:github"  /> <br>
                </span>
                <span class="text-gray-950"> GitHub </span> 
            </div>
            </a>


            <a
            href="https://github.com/gyarab/2024-4e-petrik-Tempora/blob/main/dokumentace/Dokumentace.pdf"
            target="_blank"
            class="icon-style"
            >
            <div>
                <span>
                <Icon class="size-16 text-gray-950 " name="heroicons:document-text-solid"  /> <br>
                </span>
                <span class="text-gray-950"> Dokumentace </span> 
            </div>
            </a>


            <a
            href="https://youtu.be/QoRFG4ozItw"
            target="_blank"
            class="icon-style"
            >
            <div>
                <span>
                <Icon class="size-16 text-gray-950 " name="uil:youtube"  /> <br>
                </span>
                <span class="text-gray-950"> Video <br>
                     </span> 
            </div>
            </a>
        </div>
            
               
        </div>
    </div>
</template>

<script setup>

</script>

<style  scoped>
    
</style>