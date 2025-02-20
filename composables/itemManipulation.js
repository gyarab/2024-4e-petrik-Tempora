import {  addItem, updateItem, removeItem, fetchLastItemIdByLineId, fetchItemsByTag } from '~/composables/supabaseItem';

export function convertYearToMs (year) {
  if (year >= 100) {
    return Date.UTC(year, 0, 1);
  } else {
    // For years before 100, we need to use a different approach
    const baseYear = year >= 0 ? 1900 : 2000;
    const yearDiff = Math.abs(year - baseYear);
    return -(-Date.UTC(baseYear, 0, 1) + (yearDiff * 31536000000));
  }
};

export async function createNewItem(params) {
  const { 
    id, 
    content, 
    contextType, 
    start, 
    end, 
    isBottom,
    mainTitle,
    mainDescription,
    showSecondary,
    secondaryTitle,
    secondaryDescription,
    showDetail,
    detailTitle,
    detailDescription,
    selectedColor
  } = params;

  console.log(start, end);

  const startMs = convertYearToMs(start);
  const endMs = convertYearToMs(end);

  console.log("ahoj" + startMs, endMs);

  if(startMs > endMs) {
    throw new Error("Start year must be less than end year");
  }

  if(contextType) {
    const contextItem = {
      id: parseInt(content),
      tag: parseInt(content),
      name: mainTitle,
      group: isBottom ? 8 : 1,
      start: startMs,
      end: endMs,
      cssVariables: { '--item-background': selectedColor }
    };
    await addItem(id, contextItem, mainDescription);
    return;
  }

  const mainItem = {
    id: parseInt(content),
    tag: parseInt(content),
    name: mainTitle,
    group: isBottom ? 5 : 2,
    start: startMs,
    end: endMs,
    cssVariables: { '--item-background': selectedColor }
  };
  await addItem(id, mainItem, mainDescription);

  if (showSecondary) {
    const secondaryItem = {
      id: parseInt(content) + 1,
      tag: parseInt(content),
      name: secondaryTitle,
      group: isBottom ? 6 : 3,
      start: startMs,
      end: endMs,
      cssVariables: { '--item-background': selectedColor }
    };
    await addItem(id, secondaryItem, secondaryDescription);
  }

  if (showDetail) {
    const detailItem = {
      id: parseInt(content) + 2,
      tag: parseInt(content),
      name: detailTitle,
      group: isBottom ? 7 : 4,
      start: startMs,
      end: endMs,
      cssVariables: { '--item-background': selectedColor }
    };
    await addItem(id, detailItem, detailDescription);
  }
}

export async function loadItemData(id, content) {
  try {
    const items = await fetchItemsByTag(id, content);
    if (items.length === 0) {
      console.warn("No items found.");
      return null;
    }

    const contextItem = items.find(item => item.group === 1 || item.group === 8);
    const regularItem = items.find(item => item.group === 2 || item.group === 5);
    const secondaryItem = items.find(item => item.group === 3 || item.group === 6);
    const detailItem = items.find(item => item.group === 4 || item.group === 7);

    return {
      isBottom: regularItem?.group === 5,
      contextType: !!contextItem,
      start: new Date(contextItem?.start || regularItem?.start).getFullYear(),
      end: new Date(contextItem?.end || regularItem?.end).getFullYear(),
      mainTitle: contextItem?.name || regularItem?.name,
      mainDescription: contextItem?.description || regularItem?.description,
      selectedColor: contextItem?.cssVariables?.['--item-background'] || 
                    regularItem?.cssVariables?.['--item-background'] || 
                    '#BAE6FD',
      showSecondary: !!secondaryItem,
      secondaryTitle: secondaryItem?.name,
      secondaryDescription: secondaryItem?.description,
      showDetail: !!detailItem,
      detailTitle: detailItem?.name,
      detailDescription: detailItem?.description
    };
  } catch (err) {
    console.error("Error loading item data:", err);
    throw err;
  }
}


export async function handleItemUpdate(params) {
  const {
    line_id,
    content,
    contextType,
    start,
    end,
    isBottom,
    mainTitle,
    mainDescription,
    showSecondary,
    secondaryTitle,
    secondaryDescription,
    showDetail,
    detailTitle,
    detailDescription,
    selectedColor,
  } = params;

  const mainGroup = contextType
  ? isBottom
    ? 8: 1
  : isBottom
    ? 5 : 2;

  const secondaryGroup = isBottom ? 6 : 3;
  const detailGroup = isBottom ? 7 : 4;

  // Fetch all related items (main, secondary, detail) by tag
  const items = await fetchItemsByTag(line_id, content);

  if (!items || items.length === 0) {
    console.error(`Main item with tag ${content} not found for line ${line_id}`);
    throw new Error(`Main item with tag ${content} not found`);
  }

  // Convert years to milliseconds
  const startMs = convertYearToMs(start);
  const endMs = convertYearToMs(end);

  if (startMs > endMs) {
    throw new Error("Start year must be less than end year");
  }

  // Extract main, secondary, and detail items based on item count
  const mainItem = items[0];
  const secondaryItem = items.length >= 2 ? items[1] : null;
  const detailItem = items.length >= 3 ? items[2] : null;

  // Update main item
  const mainItemData = {
    id: mainItem.id,
    start: startMs,
    end: endMs,
    tag: mainItem.tag,
    name: mainTitle,
    group: mainGroup,
    cssVariables: {
      '--item-background': selectedColor,
    },
  };

  await updateItem(line_id, mainItem.id, mainItemData, mainDescription);

  // Update secondary item if conditions are met
  if (showSecondary && secondaryItem) {
    const secondaryItemData = {
      id: secondaryItem.id,
      start: startMs,
      end: endMs,
      tag: secondaryItem.tag,
      name: secondaryTitle,
      group: secondaryGroup,
      cssVariables: {
        '--item-background': selectedColor,
      },
    };

    await updateItem(line_id, secondaryItem.id, secondaryItemData, secondaryDescription);
  }

  // Update detail item if conditions are met
  if (showDetail && detailItem) {
    const detailItemData = {
      id: detailItem.id,
      start: startMs,
      end: endMs,
      tag: detailItem.tag,
      name: detailTitle,
      group: detailGroup,
      cssVariables: {
        '--item-background': selectedColor,
      },
    };

    await updateItem(line_id, detailItem.id, detailItemData, detailDescription);
  }



  // Remove items if conditions are met
  // Remove detail item if it exists and showDetail is false
  if (!showDetail && detailItem) {
    await removeItem(line_id, detailItem.id);
  }

  // Remove secondary item (and potentially detail) if showSecondary is false
  if (!showSecondary && secondaryItem) {
    await removeItem(line_id, secondaryItem.id);

    // Also remove detail if it exists since it relies on secondary
    if (detailItem) {
      await removeItem(line_id, detailItem.id);
    }
  }

  // Add items if conditions are met
  let lastItemId = await fetchLastItemIdByLineId(line_id);

  // If we only have 1 item and showSecondary is true -> add secondary
  if (items.length === 1 && showSecondary) {
    lastItemId += 1;
    const secondaryItemData = {
      id: lastItemId,
      start: startMs,
      end: endMs,
      tag: content,
      name: secondaryTitle,
      group: secondaryGroup,
      cssVariables: {
        '--item-background': selectedColor,
      },
    };

    await addItem(line_id, secondaryItemData, secondaryDescription);
    console.log(`Secondary item added for tag ${content}`);
  }

  // If we have 1 or 2 items and showDetail is true -> add detail
  if ((items.length === 1 || items.length === 2) && showDetail) {
    lastItemId += 1;
    const detailItemData = {
      id: lastItemId,
      start: startMs,
      end: endMs,
      tag: content,
      name: detailTitle,
      group: detailGroup,
      cssVariables: {
        '--item-background': selectedColor,
      },
    };

    await addItem(line_id, detailItemData, detailDescription);
    console.log(`Detail item added for tag ${content}`);
  }
}

