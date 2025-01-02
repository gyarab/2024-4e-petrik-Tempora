import { ref, watch, computed } from 'vue';

export const useTimeline = (zoomLimits = { min: 0.3, max: 3 }) => {
  // Configuration for zoom and initial settings
  const minZoom = zoomLimits.min; // Minimum zoom level
  const maxZoom = zoomLimits.max; // Maximum zoom level
  const initialZoom = 0.4; // Default zoom level
  const yearToMs = (year) => Date.UTC(year, 0, 1);
  const rangeStart = ref(yearToMs(2000)); // Default range start
  const rangeEnd = ref(yearToMs(2020)); // Default range end

  // Reactive states for zoom, scroll, and viewport
  const zoomLevel = ref(initialZoom); // Current zoom level
  const scrollPosition = ref(0); // Current scroll position
  const viewportMin = ref(0); // Left edge of the viewport
  const viewportMax = ref(0); // Right edge of the viewport
  const minScroll = ref(0); // Minimum scroll limit
  const maxScroll = ref(0); // Maximum scroll limit

  // Helper function to clamp a value between min and max
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Calculate the total range of the timeline
  const timelineRange = computed(() => rangeEnd.value - rangeStart.value);

  // Update the scroll limits based on zoom level
   const updateScrollLimits = () => {
    const visibleRange = timelineRange.value / zoomLevel.value; // Calculate visible range at current zoom
    const edgeRange = visibleRange * 0.05; // Calculate the edge range (5% of the visible range)
    minScroll.value = rangeStart.value - edgeRange; // Adjust minimum scroll limit
    maxScroll.value = rangeEnd.value + edgeRange; // Adjust maximum scroll limit
  };

  const mouseHoverPosition = ref(null); // Hover position state

  // Compute markers based on hover position
  const markers = computed(() => {
    return mouseHoverPosition.value
      ? [
          {
            start: mouseHoverPosition.value,
            type: 'marker',
            id: 'mousehover',
          },
        ]
      : [];
  });

  // Update the viewport based on scroll position and zoom level
  const updateViewport = () => {
    const visibleRange = timelineRange.value / zoomLevel.value; // Calculate visible range

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
    [zoomLevel, scrollPosition, rangeStart, rangeEnd],
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

  // Handlers for hover interaction
  const onMousemoveTimeline = ({ time }) => {
    mouseHoverPosition.value = time; // Update hover position
  };

  const onMouseleaveTimeline = () => {
    mouseHoverPosition.value = null; // Clear hover position
  };

  return {
    rangeStart,
    rangeEnd,
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
    onMousemoveTimeline,
    onMouseleaveTimeline,
    markers,
    mouseHoverPosition,
  };
};
