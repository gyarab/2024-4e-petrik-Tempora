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

// State for zoom and viewport
const zoomLevel = ref(initialZoom);
const initialRange = 3000; // Base range for the timeline
const viewportMin = ref(-initialRange / 2);
const viewportMax = ref(initialRange / 2);

// Computed range of the timeline
const timelineRange = computed(() => viewportMax.value - viewportMin.value);

// Calculate the center of the current viewport
const getCenter = () => (viewportMax.value + viewportMin.value) / 2;

// Update viewport based on zoom level
const updateViewport = () => {
  const center = getCenter();
  const newRange = initialRange / zoomLevel.value;
  viewportMin.value = center - newRange / 2;
  viewportMax.value = center + newRange / 2;
};

// Watch zoomLevel and update viewport
watch(zoomLevel, updateViewport);

// Handle slider zoom change
const onZoomChange = () => {
  updateViewport();
};

// Handle mouse wheel zoom
const onMouseWheelZoom = (event) => {
  const zoomFactor = 0.1; // Adjust for smoother/faster zooming
  zoomLevel.value = Math.min(
    Math.max(zoomLevel.value - zoomFactor * Math.sign(event.deltaY), minZoom),
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