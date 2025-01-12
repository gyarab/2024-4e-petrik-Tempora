
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
    .select("line_id");

  if (error) {
    console.error("Error adding timeline:", error.message);
    throw error;
  }

  return { data: data[0], error };
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


export async function fetchTimelines(filters = {}, userId = null) {
  const supabase = useSupabaseClient()

  try {
    let query = supabase
      .from('timelines') // Replace with your actual table name
      .select(` *, user_profiles(nickname) `)
    if (filters.userTimelines && userId) {
      query = query.eq('author', userId) // Filter by user's timelines
    }
    if (filters.featured) {
      query = query.eq('featured', true) // Filter for featured timelines
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching timelines:', error)
      return []
    }

    return data
  } catch (err) {
    console.error('Unexpected error fetching timelines:', err)
    return []
  }
}


export async function fetchNickname(user) {
  const supabase = useSupabaseClient()
  try {
    const { data, error } = await supabase
      .from('user_profiles') // Adjust table name if needed
      .select('nickname')
      .eq('id', user.id) // Match the user's ID
      .single()

    if (error) {
      console.error('Error fetching nickname:', error)
      return null
    }
    return data?.nickname || null
  } catch (err) {
    console.error('Unexpected error fetching nickname:', err)
    return null
  }
}

export async function updateNickname(userId, newNickname) {
  const supabase = useSupabaseClient();
  try {
      const { error } = await supabase
          .from("user_profiles") // Adjust table name if needed
          .update({ nickname: newNickname })
          .eq("id", userId);

      if (error) throw error;
      return true; // Indicate success
  } catch (error) {
      console.error("Error updating nickname:", error.message);
      return false; // Indicate failure
  }
}
