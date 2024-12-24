import { ref, watch } from 'vue';

export const useTimeline = (
  initialRange = 3000,
  zoomLimits = { min: 0.3, max: 3 }
) => {
  // Configuration for zoom and initial settings
  const minZoom = zoomLimits.min; // Minimum zoom level
  const maxZoom = zoomLimits.max; // Maximum zoom level
  const initialZoom = 1; // Default zoom level

  // Reactive states for zoom, scroll, and viewport
  const zoomLevel = ref(initialZoom); // Current zoom level
  const scrollPosition = ref(0); // Current scroll position
  const viewportMin = ref(-initialRange / 2); // Left edge of the viewport
  const viewportMax = ref(initialRange / 2); // Right edge of the viewport
  const minScroll = ref(-initialRange * 2); // Minimum scroll limit
  const maxScroll = ref(initialRange * 2); // Maximum scroll limit

  // Helper function to clamp a value between min and max
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Update the scroll limits based on zoom level
  const updateScrollLimits = () => {
    const visibleRange = initialRange / zoomLevel.value; // Calculate visible range at current zoom
    minScroll.value = -initialRange * 2 + visibleRange / 2; // Adjust minimum scroll limit
    maxScroll.value = initialRange * 2 - visibleRange / 2; // Adjust maximum scroll limit
  };

  // Update the viewport based on scroll position and zoom level
  const updateViewport = () => {
    const visibleRange = initialRange / zoomLevel.value; // Calculate visible range

    // Clamp the scroll position to keep it within bounds
    scrollPosition.value = clamp(
      scrollPosition.value,
      minScroll.value,
      maxScroll.value
    );

    // Calculate new viewport edges
    viewportMin.value = scrollPosition.value - visibleRange / 2;
    viewportMax.value = scrollPosition.value + visibleRange / 2;
  };

  // Watchers to update scroll limits and viewport when zoom or scroll changes
  watch(
    [zoomLevel, scrollPosition],
    () => {
      updateScrollLimits(); // Recalculate scroll limits
      updateViewport(); // Update the visible area
    },
    { immediate: true } // Run immediately on initialization
  );

  // Handlers for user interactions

  // Handle zoom changes (e.g., slider input)
  const onZoomChange = () => {
    updateScrollLimits(); // Recalculate scroll limits
    updateViewport(); // Update the viewport
  };

  // Handle scroll changes (e.g., drag or scroll bar input)
  const onScrollChange = (value) => {
    scrollPosition.value = clamp(value, minScroll.value, maxScroll.value); // Keep within bounds
  };

  // Handle mouse wheel zoom (e.g., zooming with scroll wheel)
  const onMouseWheelZoom = (deltaY) => {
    const zoomFactor = 0.1; // Amount to change zoom per scroll
    let newZoomLevel = zoomLevel.value - zoomFactor * Math.sign(deltaY); // Adjust zoom level

    // Clamp the new zoom level to ensure it stays within valid bounds
    newZoomLevel = clamp(newZoomLevel, minZoom, maxZoom);

    zoomLevel.value = newZoomLevel; // Update the zoom level
    onZoomChange(); // Update related states
  };

  // Return all reactive variables and handlers
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
