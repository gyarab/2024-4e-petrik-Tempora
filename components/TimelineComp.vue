<template>
  <div v-if="isLoading">
    <p>Loading timeline...</p>
  </div>
    <div v-else
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
        :fixedLabels=true
        @mousemoveTimeline="onMousemoveTimeline"
        @mouseleaveTimeline="onMouseleaveTimeline"
      >
      <template #item="{ item }">
        <NuxtLink
          :to="`/lines/${id}/${item.tag}`"
          style="inset: 0; position: absolute; padding: .2em 1em; color: white; font-weight: bold; text-decoration: none;"
          :data-tippy-content="item.tooltip"
        >
          {{ item.name }}
        </NuxtLink>
      </template>
      </Timeline>
    </div>    
 
    <div class="bg-white dark:bg-zinc-800 black-white controls-container">
      <div class="year-display-container">
        {{ mouseHoverPosition ? "Ukazatel myši nad rokem " + new Date(mouseHoverPosition).getUTCFullYear() : 'Umístěním kurzoru na časovou osu zobrazíte rok' }}
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
        <Icon class="size-7 " name="uil:search-alt" />
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
import { ref, computed, onMounted } from 'vue';
import { useTimeline } from '@/composables/timelineFeatures';
import { fetchItemsByLineId } from '@/composables/supabaseItem';
import { useRoute } from 'vue-router';
import { Timeline } from 'vue-timeline-chart';
import 'vue-timeline-chart/style.css';

const route = useRoute();
const id = route.params.id;

const isLoading = ref(true);
const items = ref([]);
const groups = ref([]);
const rangeStart = ref(0);
const rangeEnd = ref(null);

// Timeline utilities (initialize but reactive to rangeStart, rangeEnd)
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
} = useTimeline(rangeStart, rangeEnd);

async function fetchData() {
  try {
    const timeline = await fetchInfo(id);
    rangeStart.value = timeline.start;
    rangeEnd.value = timeline.end;

    const fetchedItems = await fetchItemsByLineId(id);

    const groupCssMap = {
      1: 'contextGroupCss',
      2: 'primaryGroupCss',
      3: 'secondaryGroupCss',
      4: 'detailGroupCss',
      5: 'primaryGroupCss',
      6: 'secondaryGroupCss',
      7: 'detailGroupCss',
      8: 'contextGroupCss',
    };

    items.value = fetchedItems.map((item) => {
      const itemData = item.item_data;
      const type = itemData.end ? 'range' : 'point';

      return {
        ...itemData,
        className: groupCssMap[itemData.group] || '',
        type,
      };
    });

    groups.value = [
      { id: 1, label: timeline.groups[1], className: 'kontextGroup' },
      { id: 2, label: timeline.groups[2], className: 'primaryGroup' },
      { id: 3, label: timeline.groups[3], className: 'secondaryGroup' },
      { id: 4, label: timeline.groups[4], className: 'detailGroup' },
      { id: 'Timestamps'},
      { id: 5, label: timeline.groups[5], className: 'primaryGroup' },
      { id: 6, label: timeline.groups[6], className: 'secondaryGroup' },
      { id: 7, label: timeline.groups[7], className: 'detailGroup' },
      { id: 8, label: timeline.groups[8], className: 'kontextGroup' },
    ];
  } catch (error) {
    console.error('Failed to fetch timeline data:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
</script>
  
<style>

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
.timeline-container {
  margin-top: 5px;
  margin-bottom: 50px;
  position: relative;
  overflow: hidden;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #ffffff;
  height:fit-content
}

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
 width:100%;
 padding: 10px;
 z-index: 20;
}
 

.controls-container label {
    margin-right: 10px;
    align-self: center;
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
  /*align-items: center; /* Vertically centers the label (Not centered due to item height)  */
  justify-content: flex-start; /* Keeps the label aligned to the left */
  padding-bottom: 0 !important;
}


.contextGroupCss{
  height: var(--group-height) !important;
}
.primaryGroupCss{
  height: var(--primaryGH) !important;
}
.secondaryGroupCss{
  height: var(--secondaryGH) !important;
}
.detailGroupCss{
  height: var(--detailGH) !important;
}
</style>
