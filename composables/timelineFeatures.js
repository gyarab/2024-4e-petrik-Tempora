import { ref, watch } from 'vue';

export const useTimeline = (initialRange = 3000, zoomLimits = { min: 0.3, max: 3 }) => {
  const minZoom = zoomLimits.min;
  const maxZoom = zoomLimits.max;
  const initialZoom = 1;

  const zoomLevel = ref(initialZoom);
  const viewportMin = ref(-initialRange / 2);
  const viewportMax = ref(initialRange / 2);
  const minScroll = -initialRange * 2;
  const maxScroll = initialRange * 2;
  const scrollPosition = ref(0);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateViewport = () => {
    const currentRange = initialRange / zoomLevel.value;
    scrollPosition.value = clamp(
      scrollPosition.value,
      minScroll + currentRange / 2,
      maxScroll - currentRange / 2
    );

    const newViewportMin = scrollPosition.value - currentRange / 2;
    const newViewportMax = scrollPosition.value + currentRange / 2;

    if (newViewportMin < newViewportMax) {
      viewportMin.value = newViewportMin;
      viewportMax.value = newViewportMax;
    } else {
      console.error(
        `[vue-timeline-chart] Invalid viewport range: min=${newViewportMin}, max=${newViewportMax}`
      );
    }
  };

// Watch zoom level and scroll position to update the viewport
watch([zoomLevel, scrollPosition], updateViewport, { immediate: true });

  // Handle slider zoom change
const onZoomChange = () => {
  updateViewport();
};

// Handle horizontal scroll change
const onScrollChange = (value) => {
  scrollPosition.value = clamp(value, minScroll, maxScroll);
};

// Handle mouse wheel zoom
const onMouseWheelZoom = (deltaY) => {
  const zoomFactor = 0.1; // Adjust for smooth zoom
  let newZoomLevel = zoomLevel.value - zoomFactor * Math.sign(deltaY); // Declare with 'let'

  newZoomLevel = clamp(newZoomLevel, minZoom, maxZoom); // Ensure it is within bounds

  if (isNaN(newZoomLevel)) {
    console.error(`[vue-timeline-chart] Invalid zoomLevel: ${newZoomLevel}`);
    return; // Exit to prevent further invalid updates
  }

  zoomLevel.value = newZoomLevel;
  updateViewport(); 
};

return {
  minZoom,
  maxZoom,
  zoomLevel,
  viewportMin,
  viewportMax,
  minScroll,
  maxScroll,
  scrollPosition,
  onZoomChange,
  onScrollChange,
  onMouseWheelZoom,
};
};