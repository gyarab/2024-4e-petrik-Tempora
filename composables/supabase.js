
async function addTimeline({ start, end, name, line_id = null }, userId) {
    // Validate start and end
    if (start >= end) {
      throw new Error("Start value must be less than End value.");
    }
  
    // Generate a unique 6-digit line_id if not provided
    if (!line_id) {
      line_id = await generateUniqueLineId();
    }
  
    // Insert the timeline
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

  async function generateUniqueLineId() {
    let line_id;
    let isUnique = false;
  
    while (!isUnique) {
      line_id = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
  
      // Check if the line_id already exists in the database
      const { data, error } = await supabase
        .from("timelines")
        .select("line_id")
        .eq("line_id", line_id)
        .limit(1);
  
      if (error) {
        console.error("Error checking line_id uniqueness:", error.message);
        throw error;
      }
  
      // If no matching line_id is found, it's unique
      isUnique = data.length === 0;
    }
  
    return line_id;
  }