// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/fonts',
    '@nuxt/ui',
    'nuxt-color-picker',
    '@pinia/nuxt',
  ],
  tailwindcss: {
    // Add Tailwind dark mode configuration here
    config: {
      darkMode: 'class', // Enable dark mode with 'class' strategy
    }
  },
  colorMode: {
    preference: 'light', // Default theme is light
    fallback: 'light',   // Fallback if no preference is found
    classSuffix: ''      // No suffix like `-dark` (keeps it simple)
  },
  app:{
    head:{
      title: 'Tempora',
      meta:[
        {name: 'description', content: 'Interactive Timeline'}
      ],
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