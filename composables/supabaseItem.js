// Fetch all items by line_id
export async function fetchItemsByLineId(line_id) {
    const supabase = useSupabaseClient();
  
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("line_id", line_id);
  
      if (error) {
        console.error("Error fetching items by line_id:", error.message);
        throw error;
      }
  
      return data;
    } catch (err) {
      console.error("Unexpected error fetching items by line_id:", err);
      throw err;
    }
  }

// Fetch the last item ID for a given line_id
export async function fetchLastItemIdByLineId(line_id) {
  const supabase = useSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("items")
      .select("item_data")
      .eq("line_id", line_id)
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching last item id by line_id:", error.message);
      throw error;
    }

    const lastId = data.length > 0 ? data[0].item_data.id : 0;
    return lastId;
  } catch (err) {
    console.error("Unexpected error fetching last item id by line_id:", err);
    throw err;
  }
}


// Fetch items by line_id and tag from JSONB item_data
export async function fetchItemsByTag(line_id, tag) {
  const supabase = useSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("items")
      .select("item_data, description")
      .eq("line_id", line_id)
      .filter('item_data->>tag', 'eq', tag.toString())
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching items by tag:", error.message);
      throw error;
    }

    return data.map(item => ({
      ...item.item_data,
      description: item.description
    }));
  } catch (err) {
    console.error("Unexpected error fetching items by tag:", err);
    throw err;
  }
}



// Add item to the timeline
export async function addItem(line_id, item_data, description) {
  const supabase = useSupabaseClient();

  const itemToInsert = {
      line_id,
      item_data,
      description
  };
  
  try {
      const { data, error } = await supabase.from("items").insert(itemToInsert);
      if (error) throw error;
      console.log("Insert successful:", data);
      return data;
  } catch (err) {
      console.error("Error inserting item:", err);
      throw err;
  }
}









  
  
  // Delete item from the timeline
  export async function deleteItem({ id = null, line_id = null }) {
    const supabase = useSupabaseClient();
  
    if (!id && !line_id) {
      throw new Error("You must provide either an item ID or a line ID to delete an item.");
    }
  
    try {
      let query = supabase.from("items").delete();
  
      if (id) {
        query = query.eq("id", id);
      } else if (line_id) {
        query = query.eq("line_id", line_id);
      }
  
      const { error } = await query;
  
      if (error) {
        console.error("Error deleting item:", error.message);
        throw error;
      }
  
      return true; // Confirm deletion
    } catch (err) {
      console.error("Unexpected error deleting item:", err);
      throw err;
    }
  }


  
  // Update item in the timeline
  export async function updateItem(line_id, updates) {
    const supabase = useSupabaseClient();
  
    console.log("updateItem called with:", { id: line_id, updates });
  
    try {
      const { error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", line_id);
  
      if (error) {
        console.error("Error updating item:", error.message);
        throw error;
      }
  
      console.log("updateItem successful for id:", line_id);
      return true;
    } catch (err) {
      console.error("Unexpected error updating item:", err);
      throw err;
    }
  }
  