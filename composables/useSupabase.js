// ~/composables/useSupabase.js
export async function addTimeline({ start, end, name, line_id = null }, userId) {
  const supabase = useSupabaseClient(); // Must be called inside a composable or Vue setup

  if (start >= end) {
    throw new Error("Start value must be less than End value.");
  }

  // Generate a unique line_id if not provided
  if (!line_id) {
    line_id = await generateUniqueLineId(supabase);
  }

  // Insert into the database
  const { data, error } = await supabase
    .from("timelines")
    .insert([
      {
        start,
        end,
        name,
        line_id,
        author: userId,
      },
    ])
    .select();

  if (error) {
    console.error("Error adding timeline:", error.message);
    throw error;
  }

  return data;
}

// Generate a unique line_id
async function generateUniqueLineId(supabase) {
  let line_id;
  let isUnique = false;

  while (!isUnique) {
    line_id = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit number

    // Check if it's unique
    const { data, error } = await supabase
      .from("timelines")
      .select("line_id")
      .eq("line_id", line_id)
      .limit(1);

    if (error) {
      console.error("Error checking line_id uniqueness:", error.message);
      throw error;
    }

    isUnique = data.length === 0;
  }

  return line_id;
}

// Fetch timelines for a specific user
export async function fetchTimelines(userId) {
  const supabase = useSupabaseClient();

  const { data, error } = await supabase
    .from("timelines")
    .select("*")
    .eq("author", userId);

  if (error) {
    console.error("Error fetching timelines:", error.message);
    throw error;
  }

  return data;
}
