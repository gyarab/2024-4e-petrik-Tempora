<template>
  <div class="bg-white dark:bg-zinc-800 p-6 pt-8 mt-4 rounded-lg border-2 border-black shadow-lg w-full max-w-5xl">
    <!-- Close Button -->
    <div class="absolute top-4 right-4">
      <button @click="toggleForm">
        <Icon class="size-6" name="uil:multiply"/>
      </button>
    </div>
    
    <!-- Main Content Container -->
    <div class="flex flex-col md:flex-row gap-6 w-full">
      <!-- Form Section -->
      <div class="flex-1 space-y-4 min-w-0">
        <h2 class="text-2xl font-bold text-sky-700 dark:text-sky-300 mb-4">
          Vytvořit novou časovou osu
        </h2>
        
        <form @submit.prevent="handleCreate" class="grid gap-4">
          <!-- Timeline Info -->
          <div class="space-y-2">
            <label class="text-gray-600 dark:text-gray-400">Název osy:</label>
            <UInput
              v-model="name"
              color="sky"
              type="text"
              placeholder="Zadejte název osy"
              class="w-full"
              required
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-gray-600 dark:text-gray-400">Rok začátku:</label>
              <UInput
                v-model.number="start"
                color="sky"
                type="number"
                placeholder="Rok začátku"
                class="w-full"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label class="text-gray-600 dark:text-gray-400">Rok konce:</label>
              <UInput
                v-model.number="end"
                color="sky"
                type="number"
                placeholder="Rok konce"
                class="w-full"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-gray-600 dark:text-gray-400">Popis:</label>
            <UTextarea
              v-model="description"
              color="sky"
              :autoresize="true"
              placeholder="Zadejte popis osy"
              class="w-full"
            />
          </div>

          <div class="py-2">
            <UCheckbox 
              v-model="is_private" 
              name="private" 
              label="Vytvořit jako soukromou osu" 
            />
          </div>

          <div class="pt-4">
            <UButton
              type="submit"
              class="skyButton"
              label="Vytvořit časovou osu"
            />
            <p v-if="errorMessage" class="mt-2 text-red-500 text-sm">{{ errorMessage }}</p>
          </div>
        </form>
      </div>

      <!-- Groups Section -->
      <div class="md:w-80 flex-shrink-0">
        <h3 class="font-bold text-lg mb-3">Názvy řádků:</h3>
        <div class="flex flex-col gap-2">
          <div 
            v-for="groupId in 8" 
            :key="groupId"
            class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-700 rounded border-2 border-black"
          >
            <span class="font-semibold min-w-[24px]">{{ groupId }}:</span>
            <UInput 
              v-model="groupLabels[groupId]"
              color="sky"
              type="text" 
              :placeholder="`Název řádku ${groupId}`"
              class="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
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
