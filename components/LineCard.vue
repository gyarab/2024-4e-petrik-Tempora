<template>
    <div class="line-card border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm">
      <h3 class="font-bold text-lg">{{ line.name }}
        <UIcon v-if="line.is_private" class="size-4" name="heroicons:lock-closed-16-solid"></UIcon>
        <UIcon v-if="line.featured" class="size-4" name="heroicons:star-16-solid"></UIcon>
      </h3>
      <p class="text-sm text-gray-600">Rok: {{ line.start }} - {{ line.end }}</p>
      <p class="text-sm text-gray-600">Autor: {{ line.user_profiles?.nickname || 'Unknown' }}</p>
        
      <UButton 
        class="btn bg-blue-500 text-white px-4 py-2 rounded mt-4" 
        :to="`/lines/${line.line_id}`" 
        label="Přejít na osu">
      </UButton>
    </div>
  </template>
  
  <script setup>
  defineProps({
    line: {
      type: Object,
      required: true,
    },
  });
  </script>