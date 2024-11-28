// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  tailwindcss: {
    // Add Tailwind dark mode configuration here
    config: {
      darkMode: 'class', // Enable dark mode with 'class' strategy
    }
  },
  app:{
    head:{
      title: 'Tempora',
      meta:[
        {name: 'description', content: 'Interactive Timeline'}
      ]
    }
  },
  supabase: {
    redirect: false
    },
})