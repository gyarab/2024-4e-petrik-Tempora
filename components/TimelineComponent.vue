<template>
    <div>
      <div
        class="timeline-container"
        @wheel.prevent="(event) => onMouseWheelZoom(event.deltaY)"
      >
        <Timeline
          :groups="groups"
          :items="items"
          :markers="markers"
          :viewportMin="viewportMin"
          :viewportMax="viewportMax"
          :renderTimestampLabel="(timestamp) => new Date(timestamp).getFullYear()"
          @mousemoveTimeline="onMousemoveTimeline"
          @mouseleaveTimeline="onMouseleaveTimeline"
        />
      </div>
  
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
  
      <div class="controls">
        <label for="scroll">Scroll:</label>
        <input
          type="range"
          id="scroll"
          :min="minScroll"
          :max="maxScroll"
          :step="10"
          v-model="scrollPosition"
          @input="(event) => onScrollChange(event.target.value)"
        />
      </div>

      <div>
        {{ mouseHoverPosition ? "Hovering over year " + new Date(mouseHoverPosition).getUTCFullYear() : 'Hover over the timeline to see the year' }}

      </div>
    </div>
  </template>
  
  <script setup>
  import { useTimeline } from '@/composables/timelineFeatures';
  import { Timeline } from 'vue-timeline-chart';
  import 'vue-timeline-chart/style.css';
  
  // Timeline groups and items
  const groups = [
    { id: 'group1', label: 'Kontext cz' },
    { id: 'group2', label: 'Group 2' },
    { id: 'group3', label: 'Group 3' },
    { id: 'group4', label: 'Group 4' },
    { id: 'Timestamps'}, //Timestamps
    { id: 'group5', label: 'Group 5' },
    { id: 'group6', label: 'Group 6' },
    { id: 'group7', label: 'Group 7' },
    { id: 'group8', label: 'Kontext svet' },
  ];
  const items = [
    { group: 'group1', type: 'point', start: 2000, cssVariables: { '--item-background': '#3498db' } },
    { group: 'group3', type: 'range', start: -631152000000, end: 1577836800000, cssVariables: { '--item-background': '#e74c3c' } },
    { group: 'group2', type: 'range', start: 1960, end: 1980 },
  ];
  
 // Use the composable
 const {
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
  mouseHoverPosition
} = useTimeline();



  </script>
  
  <style scoped>
  .timeline-container {
    overflow: hidden;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #ffffff;
    height: max-content;
  }
  
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

<style>

.timestamps {  
  transform: translateY(230px); /* Adjust the value as needed */
  position: absolute;
  width: 100%; /* Ensure it spans the timeline */
  z-index: 2; /* Ensure it's above other elements if needed */
  background-color: transparent !important;
}
.timeline-container {
  position: relative; /* Set relative positioning for absolute child positioning */
}
div.group {
  border-top: 0 !important; 
}

.timestamps:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 2px solid #000; /* adjust the color and thickness as needed */
  transform: translateY(-50%);
}

.timestamp {
  position: relative;
  z-index: 1;
  background-color: #fff; /* or any desired background color */
  padding: 0 10px; /* adjust the padding as needed */
  border-left: 0px !important; 
}

</style>
