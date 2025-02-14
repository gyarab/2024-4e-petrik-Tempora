import { addItem, fetchItemsByTag } from '~/composables/supabaseItem';

export function convertYearToMs(year) {
  return new Date(year, 0, 1).getTime();
}

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

  const startMs = convertYearToMs(start);
  const endMs = convertYearToMs(end);

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