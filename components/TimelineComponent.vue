<template>
    <div>
      <div
        class="timeline-container"
        @wheel.prevent="(event) => onMouseWheelZoom(event.deltaY)"
      >
        <Timeline
          :groups="groups"
          :items="items"
          :viewportMin="viewportMin"
          :viewportMax="viewportMax"
          :renderTimestampLabel="(timestamp) => timestamp"
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
    </div>
  </template>
  
  <script setup>
  import { useTimeline } from '@/composables/timelineFeatures';
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
} = useTimeline();
  </script>
  
  <style scoped>
  .timeline-container {
    overflow: hidden;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    height: 300px;
  }
  
  .controls {
    margin-bottom: 20px;
  }
  </style>