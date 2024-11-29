// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/icon',
    '@nuxt/fonts',
  ],
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
  fonts: {
    families: [
      {
        name: 'Roboto',
        provider: 'google',
        weights: [400, 700], // Regular and Bold weights
        styles: ['normal', 'italic'], // Normal and Italic styles
      },
    ],
  },
  
})