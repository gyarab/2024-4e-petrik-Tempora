<template>
    <div>
        <Head>
            <Title> Tempora | line {{ id }}</Title>
        </Head>
        
        
        <h2>Map page of timeline id: {{ id }}</h2>
        <div v-if="user">
            <NuxtLink :to="`${id}/edit`">  <p> Edit this line </p> </NuxtLink>
        </div>

        <!-- Timeline Container -->
        <div
      class="timeline-container"
      @wheel.prevent="onMouseWheelZoom"
    >
      <Timeline
        :groups="groups"
        :items="items"
        :viewportMin="viewportMin"
        :viewportMax="viewportMax"
        :renderTimestampLabel="(timestamp) => timestamp"
      />
    </div>

    <!-- Zoom Slider -->
    <div class="controls">
      <label for="zoom">Zoom:</label>
      <input
        type="range"
        id="zoom"
        :min="minZoom"
        :max="maxZoom"
        :step="0.1"
        v-model="zoomLevel"
        @input="onZoomChange"
      />
    </div>

    <!-- Horizontal Scroll Slider -->
    <div class="controls">
      <label for="scroll">Scroll:</label>
      <input
        type="range"
        id="scroll"
        :min="minScroll"
        :max="maxScroll"
        :step="10"
        v-model="scrollPosition"
        @input="onScrollChange"
      />
    </div>
        
        
    </div>
</template>

<script setup>
    const { id } = useRoute().params
    const user = useSupabaseUser()

    // Logika pro error page kdyz osa neexistuje
    if(!true)
    {
        throw createError({statusCode: 404, statusMessage: 'Osa nebyla nalezena', fatal:true})
    }

    //Timeline
    import { ref, computed } from 'vue';
    import { Timeline } from 'vue-timeline-chart';
    import 'vue-timeline-chart/style.css';

// Timeline groups and items
const groups = [
  { id: 'group1', label: 'Group 1' },
  { id: 'group2', label: 'Group 2' },
];

const items = [
  { group: 'group1', type: 'point', start: -200, cssVariables: { '--item-background': '#3498db' } },
  { group: 'group1', type: 'range', start: -400, end: 200, cssVariables: { '--item-background': '#e74c3c' } },
  { group: 'group2', type: 'range', start: 500, end: 1500 },
];

// Zoom parameters
const minZoom = 0.3; // Minimum zoom level (zoom out)
const maxZoom = 3; // Maximum zoom level (zoom in)
const initialZoom = 1; // Default starting zoom level

// State for zoom, viewport, and horizontal scroll
const zoomLevel = ref(initialZoom);
const initialRange = 3000; // Base range for the timeline
const viewportMin = ref(-initialRange / 2);
const viewportMax = ref(initialRange / 2);

// Horizontal scroll parameters
const minScroll = -initialRange * 2; // Minimum scroll position
const maxScroll = initialRange * 2; // Maximum scroll position
const scrollPosition = ref(0); // Initial scroll position

// Utility: Clamp a value between a min and max
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Update viewport based on zoom level and scroll position
const updateViewport = () => {
  const currentRange = initialRange / zoomLevel.value;

  // Constrain scroll position to ensure valid viewport
  scrollPosition.value = clamp(
    scrollPosition.value,
    minScroll + currentRange / 2,
    maxScroll - currentRange / 2
  );

  // Calculate new viewport range
  const newViewportMin = scrollPosition.value - currentRange / 2;
  const newViewportMax = scrollPosition.value + currentRange / 2;

  // Safeguard: Ensure viewportMin is smaller than viewportMax
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
const onScrollChange = (event) => {
  scrollPosition.value = clamp(Number(event.target.value), minScroll, maxScroll);
};

// Handle mouse wheel zoom
const onMouseWheelZoom = (event) => {
  const zoomFactor = 0.1; // Adjust for smoother/faster zooming
  zoomLevel.value = clamp(
    zoomLevel.value - zoomFactor * Math.sign(event.deltaY),
    minZoom,
    maxZoom
  );
};

</script>
<style scoped>
/* Timeline Container */
.timeline-container {
  overflow: hidden;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  height: 300px;
}

/* Controls for Zoom Slider */
.controls {
  margin-bottom: 20px;
}

.controls label {
  margin-right: 10px;
  font-weight: bold;
}

.controls input[type="range"] {
  width: 200px;
}
</style>