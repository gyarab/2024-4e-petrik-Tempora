<template>
  <div class="line-card">
    <h3 class="font-bold">{{ line.name }}</h3>
    <p>Rok: {{ line.start }} - {{ line.end }}</p>
    <p>Autor: {{ line.author }}</p>
      
    <UButton :to="`/lines/${line.line_id}`" label="Přejít na osu"></UButton>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  line: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.line-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: #f9f9f9;
}
</style>