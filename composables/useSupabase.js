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
          .from("user_profiles")
          .update({ nickname: newNickname })
          .eq("id", userId);

      if (error) {
          if (error.message.includes('value too long')) {
              throw new Error('Přezdívka nesmí být delší než 32 znaků');
          }
          throw error;
      }
      return true;
  } catch (error) {
      console.error("Error updating nickname:", error.message);
      throw error; // Propagate the error to handle it in the component
  }
}

export async function toggleBookmark(line_id, userID, isBookmarked) {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  
  if (!user) {
    throw new Error("User not logged in.");
  }

  try {
    if (isBookmarked) {
      // If bookmarked, delete the record
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ user_id: userID, line_id });

      if (error) {
        console.error("Error removing bookmark:", error.message);
        throw error;
      }
    } else {
      // If not bookmarked, insert the record
      const { error } = await supabase
        .from("bookmarks")
        .insert({ user_id: userID, line_id });

      if (error) {
        console.error("Error adding bookmark:", error.message);
        throw error;
      }
    }

    // Toggle the state
    return !isBookmarked;
  } catch (err) {
    console.error("Unexpected error toggling bookmark:", err);
    throw err;
  }
}

export async function fetchBookmarkState(id, user) {
  const supabase = useSupabaseClient();

  if (!user.value) {
    console.error("User is not logged in.");
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.value.id)
      .eq("line_id", id);

    if (error) {
      console.error("Error fetching bookmark state:", error.message);
      return false;
    }

    return data.length > 0; // Return true if the line is bookmarked
  } catch (err) {
    console.error("Unexpected error fetching bookmark state:", err);
    return false;
  }
}



// TIMELINE RELATED FUNCTIONS

// Fetch timeline information by ID
export async function fetchInfo(id) {
  const supabase = useSupabaseClient();

  const { data, error } = await supabase
    .from("timelines")
    .select("*, user_profiles(nickname)")
    .eq("line_id", id)
    .maybeSingle();

  if (error) {
    // Optional: log only unexpected errors, suppress 'not found'
    if (error.code !== 'PGRST116') {
      console.error("Unexpected error fetching timeline info:", error);
    }
    throw error; // Still throw so the caller can handle it
  }

  return data;
}

export async function updateSettings(id, updates) {
  const supabase = useSupabaseClient();
  console.log("updates", updates);
  try {
    const { error } = await supabase
      .from("timelines")
      .update(updates)
      .eq("line_id", id);

    if (error) {
      console.error("Error updating timeline settings:", error.message);
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error updating timeline settings:", err);
    throw err;
  }
}

export async function deleteTimeline(lineId) {
  const supabase = useSupabaseClient();

  try {
    const { error } = await supabase
      .from("timelines")
      .delete()
      .eq("line_id", lineId);

    if (error) {
      console.error("Error deleting timeline:", error.message);
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting timeline:", err);
    throw err;
  }
}


  export async function addTimeline({ start, end, name, is_private, description, groups, line_id = null }, userId) {
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
          description,
          is_private,
          author: userId,
          groups,
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
  
  export async function fetchTimelines(filters = {}, userId) {
    const supabase = useSupabaseClient();
  
    try {
      let query = supabase
        .from('timelines')
        .select('*, user_profiles(nickname)');
  
      if (filters.userTimelines && userId) {
        query = query.eq('author', userId); // Filter by user's timelines
      }
      if (filters.featured) {
        query = query.eq('featured', true); // Filter for featured timelines
      }
      if (filters.bookmarked && userId) {
        query = supabase
          .from('bookmarks') // Join bookmarks with timelines
          .select('timelines(*, user_profiles(nickname))')
          .eq('user_id', userId);
      }
      if (filters.id) {
        query = query.eq('line_id', filters.id); // Filter by 6-digit ID
      }
  
      const { data, error } = await query;
  
      if (error) {
        console.error('Error fetching timelines:', error);
        return [];
      }
  
      // If fetching bookmarks, data contains nested timelines
      return filters.bookmarked ? data.map((bookmark) => bookmark.timelines) : data;
    } catch (err) {
      console.error('Unexpected error fetching timelines:', err);
      return [];
    }
  }