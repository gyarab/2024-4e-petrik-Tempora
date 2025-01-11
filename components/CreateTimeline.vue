<template>
    <!-- New Line Form -->
    <UCard class="mb-5">
        <form @submit.prevent="handleCreate">
            <div class="space-y-4">
            <!-- Name Input -->
            <UInput
                v-model="name"
                type="text"
                placeholder="Enter the timeline name"
                required
                label="Name"
            />

            <!-- Start Input -->
            <UInput
                v-model.number="start"
                type="number"
                placeholder="Enter start value"
                required
                label="Start (smallint)"
            />

            <!-- End Input -->
            <UInput
                v-model.number="end"
                type="number"
                placeholder="Enter end value"
                required
                label="End (smallint)"
            />

            <!-- Submit Button -->
            <UButton type="submit" variant="ghost" block label="Vytvořit osu"></UButton>
            <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
            </div>
        </form>
        </UCard>
</template>

<script setup>
import { addTimeline } from "~/composables/useSupabase";
import { ref } from 'vue';


const errorMessage = ref("");
const user = useSupabaseUser();
const name = ref("");
const start = ref(null);
const end = ref(null);
const router = useRouter()

const handleCreate = async () => {
  errorMessage.value = "";
  
  if (!user?.value?.id) {
    errorMessage.value = "User is not authenticated.";
    return;
  }

  try {
    const newTimeline = {
      name: name.value,
      start: start.value,
      end: end.value,
    };

    // Add the timeline using the composable
    console.log(user.value.id);
    const { data, error } = await addTimeline(newTimeline, user.value.id);

    if (error) {
      throw new Error(error.message);
    }

    // Ensure the timeline was created successfully
    if (data && data.line_id) {
      name.value = "";
      start.value = null;
      end.value = null;

      // Redirect to the newly created timeline
      router.push(`/lines/${data.line_id}`);
    }
  } catch (error) {
    errorMessage.value = error.message || "An error occurred while creating the timeline.";
  }
};
</script>

<style scoped>

</style>