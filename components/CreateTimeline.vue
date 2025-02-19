<template>
  <div class="absolute top-0 right-0">
    <button @click="toggleForm">
      <Icon class="size-8" name="uil:multiply"></Icon>
    </button>
  </div>

  <!-- New Line Form -->
  <UCard class="mb-5">
    <form @submit.prevent="handleCreate">
      <div class="space-y-4">
        <!-- Name Input -->
        <UInput v-model="name" type="text" placeholder="Název nové časové osy" required label="Name" />

        <!-- Start Input -->
        <UInput v-model.number="start" type="number" placeholder="Rok začátku" required label="Start (smallint)" />

        <!-- End Input -->
        <UInput v-model.number="end" type="number" placeholder="Rok konce" required label="End (smallint)" />

        <!-- Group Inputs -->
        <div v-for="groupId in 8" :key="groupId">
          <UInput v-model="groupLabels[groupId]" type="text" :placeholder="`Název řádku: ${groupId}`" :label="`Group ${groupId} Label`" />
        </div>

        <UTextarea v-model="description" autoresize placeholder="Popis osy" />
        <UCheckbox v-model="is_private" name="private" label="Vytvořit soukromou osu" />

        <!-- Submit Button -->
        <UButton type="submit" variant="ghost" block label="Vytvořit osu"></UButton>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      </div>
    </form>
  </UCard>
</template>

<script setup>
import { addTimeline } from "~/composables/useSupabase";
import { ref } from "vue";
import { toggleForm } from "~/composables/state";

const errorMessage = ref("");
const user = useSupabaseUser();
const name = ref("");
const start = ref(null);
const end = ref(null);
const description = ref("");
const is_private = ref(false);
const router = useRouter();

// Store labels for groups 1-8
const groupLabels = ref({
  1: "Kontext nahoře",
  2: "Hlavní řádek nahoře",
  3: "Sekundární řádek",
  4: "Detail řádek",
  5: "Hlavní řádek dole",
  6: "Sekundární řádek",
  7: "Detail řádek",
  8: "Kontext dole",
});

const handleCreate = async () => {
  errorMessage.value = "";

  if (!user?.value?.id) {
    errorMessage.value = "User is not authenticated.";
    return;
  }

  try {
    // Build the groups object dynamically
    const groupsData = {};
    for (let i = 1; i <= 8; i++) {
      groupsData[i.toString()] = groupLabels.value[i] || `Group ${i}`;
    }

    const newTimeline = {
      name: name.value,
      start: start.value,
      end: end.value,
      description: description.value,
      is_private: is_private.value,
      groups: groupsData,
    };

    const { data, error } = await addTimeline(newTimeline, user.value.id);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.line_id) {
      name.value = "";
      start.value = null;
      end.value = null;
      description.value = "";
      is_private.value = false;

      // Reset group labels to default
      groupLabels.value = {
        1: "Kontext nahoře",
        2: "Hlavní řádek nahoře",
        3: "Sekundární řádek",
        4: "Detail řádek",
        5: "Hlavní řádek dole",
        6: "Sekundární řádek",
        7: "Detail řádek",
        8: "Kontext dole",
      };

      toggleForm();
      router.push(`/lines/${data.line_id}`);
    }
  } catch (error) {
    errorMessage.value = error.message || "An error occurred while creating the timeline.";
  }
};
</script>

<style scoped></style>
