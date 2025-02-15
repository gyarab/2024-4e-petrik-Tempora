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



// Update item in the timeline
export async function updateItem(line_id, item_data_id, item_data, description) {
  const supabase = useSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('items')
      .update({ item_data, description })
      .eq('line_id', line_id)
      .filter('item_data->>id', 'eq', item_data_id.toString());

    if (error) throw error;

    console.log('Update successful:', data);
    return data;
  } catch (err) {
    console.error('Error updating item:', err);
    throw err;
  }
}








// Remove item from the timeline
export async function removeItem(line_id, id) {
  const supabase = useSupabaseClient();

  try {
    const { data, error } = await supabase.from('items').delete().eq('id', id).eq('line_id', line_id);
    if (error) throw error;
    console.log('Delete successful:', data);
    return data;
  } catch (err) {
    console.error('Error deleting item:', err);
    throw err;
  }
}
  