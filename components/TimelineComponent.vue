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
        >
        <template #item="{ item }">
      <div
        style="inset: 0; position: absolute; padding: .2em 1em; color: white; font-weight: bold;"
        :data-tippy-content="item.tooltip"
      >
        {{ item.name }}
      </div>
    </template>
      </Timeline>
    </div>    
  </div>
  <div class="controls-container">
        <div class="year-display-container">
          {{ mouseHoverPosition ? "Hovering over year " + new Date(mouseHoverPosition).getUTCFullYear() : 'Hover over the timeline to see the year' }}
        </div>
        
        <div class="scroll-container">
          <input
            type="range"
            id="scroll"
            :min="minScroll"
            :max="maxScroll"
            :step="10"
            v-model="scrollPosition"
            @input="(event) => onScrollChange(event.target.value)"
            class="w-full appearance-none border-sky-900 border-2 rounded-md"
          />
        </div>

        <div class="zoom-container">
          <Icon class="size-7 " name="material-symbols:zoom-in-rounded" />
          <input
            type="range"
            id="zoom"
            :min="minZoom"
            :max="maxZoom"
            :step="0.1"
            v-model="zoomLevel"
            @input="onZoomChange"
          />
          <span class="ml-2 inline-block "  style="width: 3ch;"> {{ Math.round((zoomLevel - minZoom) / (maxZoom - minZoom) * 100) }}%</span>
        </div>
      </div>
</template>
  
  <script setup>
  import { useTimeline } from '@/composables/timelineFeatures';
  import { Timeline } from 'vue-timeline-chart';
  import 'vue-timeline-chart/style.css';
  
  // Timeline groups and items
  const groups = [
    { id: 'group1', label: 'Kontext cz', className: 'kontextGroup' },
    { id: 'group2', label: 'Group 2', className: 'primaryGroup', },
    { id: 'group3', label: 'Group 3', className: 'secondaryGroup'  },
    { id: 'group4', label: 'Group 4', className: 'detailGroup' },
    { id: 'Timestamps'}, //Timestamps
    { id: 'group5', label: 'Group 5', className: 'primaryGroup' },
    { id: 'group6', label: 'Group 6', className: 'secondaryGroup' },
    { id: 'group7', label: 'Group 7', className: 'detailGroup' },
    { id: 'group8', label: 'Kontext svet',  className: 'kontextGroup' },
  ];
  const items = [
    { id:'0', name: 'W', group: 'group1', type: 'point', start: 2000, cssVariables: { '--item-background': '#3498db' } },
    { id:'1', name: 'Raketa', group: 'group2', type: 'range', start: 946684800000, end: 1577836800000, cssVariables: { '--item-background': '#e74c3c' } },
    { id:'3', name: 'Super jmeno 0123456789',group: 'group2', type: 'range', start: -631152000000, end: 946684800000 },
    { id:'4', name: 'W', group: 'group1', type: 'marker', start: -400000000000, cssVariables: { '--item-background': '#000' } },
    { id:'5', name: 'W', group: 'group4', type: 'background', start: -400000000000, cssVariables: { '--item-background': '#000' } }, //IDK co to ma byt
    { id:'6', name: 'Autor Raketa', group: 'group3', type: 'range', start: 946684800000, end: 1577836800000, cssVariables: { '--item-background': '#e74c3c' } },
    { id:'7', name: 'Dílo autora z  o b d o b í Raketa', group: 'group4', type: 'range', start: 946684800000, end: 1577836800000, cssVariables: { '--item-background': '#e74c3c' } },
  ];
  
 // Use the composableA
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
  mouseHoverPosition,
} = useTimeline();
</script>
  
<style>
   .controls-container {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: 50px;
    background-color: white;
    width:100% ;
    padding: 10px;
    z-index: 1000;
  }

  .scroll-container {
    flex: 1 1 50%; /* 50% of the width */
    display: flex;
    align-items: center; /* Vertically aligns elements */
  }

  .zoom-container {
    flex: 1 1 25%; /* 25% of the width */
    display: flex;
    align-items: center; /* Vertically aligns elements */
    justify-content: center;
  }

  .year-display-container {
    flex: 1 1 25%; /* Remaining 25% of the width */
    display: flex;
    align-items: center; /* Vertically aligns elements */
    justify-content: flex-start; /* Aligns text to the right */
  }

  .controls-container label {
    margin-right: 10px;
    font-weight: bold;
    align-self: center;
  }

  .timeline-container {
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    padding: 10px;
    margin-left: 10px;
    background-color: #ffffff;
    height:fit-content
  }
  

:root {
  --group-height: clamp(40px, 10vh, 15vh); /* Minimum, preferred , max */
  --primaryGH:calc(var(--group-height) * 1.25);
  --secondaryGH:calc(var(--group-height) * 0.85);
  --detailGH:calc(var(--group-height) * 0.75);
}


.kontextGroup{
    background-color: #1eff0017;
    height: var(--group-height);
  }

  .primaryGroup {
  background-color: #0400ff0a;
  height: var(--primaryGH);
}

.secondaryGroup{
  background-color: #ff88001a;
  height: var(--secondaryGH);
}

.detailGroup{
  background-color: #ff000015;
  height: var(--detailGH);
}


.timestamps {  
  transform: translateY(calc(var(--group-height) + var(--primaryGH) + var(--secondaryGH) + var(--detailGH)));
  position: absolute;
  width: 100%; /* Ensure it spans the timeline */
  z-index: 2; /* Ensure it's above other elements if needed */
  background-color: transparent !important;
}
.timeline-container {
  position: relative; /* Set relative positioning for absolute child positioning */
}
div.group {
  border-top: 0 !important; /* TODO */  
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


.group{
  display: flex;
  align-items: center; /* Vertically centers the label */
  justify-content: flex-start; /* Keeps the label aligned to the left */
  padding-bottom: 0 !important;
}

</style>
