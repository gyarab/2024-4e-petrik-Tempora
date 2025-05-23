<template>
  <div v-if="isLoading" class="flex flex-col items-center justify-center h-[80vh] space-y-8">
    <h2 class="text-3xl font-bold text-center dark:text-sky-300 text-sky-950">Načítání časové osy...</h2>
    <div class="w-96 space-y-4">
      <UProgress
        animation="carousel"
        color="sky"
        class="w-full"
        size="lg"
      />
      <p class="text-center text-gray-600 dark:text-gray-200">{{ loadingMessage }}</p>
    </div>
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
          style="inset: 0;
            position: absolute;
            color: white;
            font-weight: bold;
            text-decoration: none;
            overflow: hidden;
            height: 95%;
            width: 95%;"
          :data-tippy-content="item.tooltip"
        >
        <span  >{{ item.name }}</span>
        </NuxtLink>
      </template>
      </Timeline>
    </div>    
 
    <div class="bg-white dark:bg-zinc-900 controls-container">
      <div class="year-display-container">
        {{ mouseHoverPosition ? "Kurzor nad rokem " + new Date(mouseHoverPosition).getUTCFullYear() : 'Umístěním kurzoru na osu zobrazíte rok' }}
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
import { timelineDarkMode } from '../composables/state';
import { useTimelineStore } from '~/stores/timeline';

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const isLoading = ref(true);
const items = ref([]);
const groups = ref([]);
const rangeStart = ref(0);
const rangeEnd = ref(null);

// Add new refs for loading state
const loadingMessage = ref('Připojování k databázi...')

// Add new refs for sorted items
const topItems = ref([]);
const bottomItems = ref([]);

const timelineStore = useTimelineStore();

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

const timelineStyles = computed(() => ({
  kontextGroup: {
    color: timelineDarkMode.value ? 'white' : 'black',
    backgroundColor: timelineDarkMode.value ? '#00040560' : '#ffffff15',
    borderColor: timelineDarkMode.value ? '#4a4a4a' : '#e5e5e5'  
  },
  primaryGroup: {
    color: timelineDarkMode.value ? 'white' : 'black',
    backgroundColor: timelineDarkMode.value ? '#05252d60' : '#3de2ff15',
    borderColor: timelineDarkMode.value ? '#4a4a4a' : '#e5e5e5'
  },
  secondaryGroup: {
    color: timelineDarkMode.value ? 'white' : 'black',
    backgroundColor: timelineDarkMode.value ? '#00040560' : '#ffffff15',
    borderColor: timelineDarkMode.value ? '#4a4a4a' : '#e5e5e5'
  },
  detailGroup: {
    color: timelineDarkMode.value ? 'white' : 'black',
    backgroundColor: timelineDarkMode.value ? '#05252d60' : '#3de2ff15',
    borderColor: timelineDarkMode.value ? '#4a4a4a' : '#e5e5e5'
  },
  timestamp: {
    color: timelineDarkMode.value ? 'white' : 'black',
    backgroundColor: timelineDarkMode.value ? '#000000' : '#ffffff',
    borderColor: timelineDarkMode.value ? '#4a4a4a' : '#e5e5e5'
  },
  container: {
    backgroundColor: timelineDarkMode.value ? '#000000' : '#ffffff'
  },
  itemStyle: {
    borderColor: timelineDarkMode.value ? '#ffffff' : '#000000'
  }
}));

// Modify fetchData function to include sorting
async function fetchData() {
  try {
    loadingMessage.value = 'Načítání informací o časové ose...'
    const timeline = await fetchInfo(id)
    
    if (!timeline) {
      throw new Error('TimelineNotFound')
    }
    
    loadingMessage.value = 'Zpracování časového rozsahu...'
    rangeStart.value = timeline.start
    rangeEnd.value = timeline.end

    loadingMessage.value = 'Nastavování řádků...'
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

    loadingMessage.value = 'Načítání událostí...'
    const fetchedItems = await fetchItemsByLineId(id)

    loadingMessage.value = 'Zpracování událostí...'
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
      const type = itemData.start === itemData.end ? 'point' : 'range';
      const baseClass = groupCssMap[itemData.group] || '';

      return {
        ...itemData,
        className: `${baseClass} timeline-item-style`,
        type,
      };
    });

    // Sort items into top and bottom arrays with names
    const topItemsList = fetchedItems
      .filter(item => item.item_data.group === 2)
      .sort((a, b) => a.item_data.start - b.item_data.start)
      .map(item => ({
        id: item.item_data.tag,
        name: item.item_data.name
      }));

    const bottomItemsList = fetchedItems
      .filter(item => item.item_data.group === 5)
      .sort((a, b) => a.item_data.start - b.item_data.start)
      .map(item => ({
        id: item.item_data.tag,
        name: item.item_data.name
      }));

    timelineStore.setTopItems(topItemsList);
    timelineStore.setBottomItems(bottomItemsList);

    loadingMessage.value = 'Dokončování...'
  } catch (error) {
    // Error handling for invalid timelines
    if (error.message === 'TimelineNotFound' || error.code === 'PGRST116') {
      showError({
        statusCode: 404,
        message: 'Časová osa neexisuje nebo je soukromá.',
      });
    } else {
      console.error('Unexpected error fetching timeline data:', error);
      showError({
        statusCode: 500,
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  } finally {
    isLoading.value = false;
  }
}
onMounted(fetchData);
</script>
  
<style>
.scroll-container {
  flex: 1 1 50%;
  display: flex;
  align-items: center;
}

.zoom-container {
  flex: 1 1 25%; 
  display: flex;
  align-items: center; 
  justify-content: center;
}

.year-display-container {
  flex: 1 1 25%; 
  display: flex;
  align-items: center; 
  justify-content: flex-start; 
}
.timeline-container {
  margin-top: 5px;
  margin-bottom: 50px;
  position: relative;
  overflow: hidden;
  border: 1px solid #636363;
  padding: 10px;
  background-color: v-bind('timelineStyles.container.backgroundColor');
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
 width:100%;
 padding: 10px;
 z-index: 20;
}
 

.controls-container label {
    margin-right: 10px;
    align-self: center;
  }


:root {
  --group-height: clamp(10px, 10.5vh, 15vh); /* Minimum, preferred , max */
  --primaryGH:calc(var(--group-height) * 1.25);
  --secondaryGH:calc(var(--group-height) * 0.85);
  --detailGH:calc(var(--group-height) * 0.75);
}


.kontextGroup{
  color: v-bind('timelineStyles.kontextGroup.color');
  background-color: v-bind('timelineStyles.kontextGroup.backgroundColor');
  height: var(--group-height);
}

.primaryGroup {
  color: v-bind('timelineStyles.primaryGroup.color');
  background-color: v-bind('timelineStyles.primaryGroup.backgroundColor');
  height: var(--primaryGH);
}

.secondaryGroup {
  color: v-bind('timelineStyles.secondaryGroup.color');
  background-color: v-bind('timelineStyles.secondaryGroup.backgroundColor');
  height: var(--secondaryGH);
}

.detailGroup {
  color: v-bind('timelineStyles.detailGroup.color');
  background-color: v-bind('timelineStyles.detailGroup.backgroundColor');
  height: var(--detailGH);
}

.timeline-container {
  position: relative;
}
div.group {
  border-top: 1px solid v-bind('timelineStyles.kontextGroup.borderColor') !important;  
}

.timestamps {  
  transform: translateY(calc(var(--group-height) + var(--primaryGH) + var(--secondaryGH) + var(--detailGH)));
  position: absolute;
  width: 100%;
  background-color: transparent !important;
}

.timestamps:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 2px solid v-bind('timelineStyles.timestamp.color');
  transform: translateY(-50%);
}

.timestamp {
  color: v-bind('timelineStyles.timestamp.color');
  position: relative;
  background-color: v-bind('timelineStyles.timestamp.backgroundColor'); 
  padding: 0 10px;
  border-left: 0px !important; 
}


.group{
  display: flex;
  justify-content: flex-start;
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

.timeline-item-style {
  border: 1px solid v-bind('timelineStyles.itemStyle.borderColor');
  text-align: center;
}

.timeline-item-style a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.timeline-item-style a span {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; 
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  max-height: 100%;
      
}

.group-label {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align:left;
  white-space: normal; 
  max-width: 100px; 

  font-weight: 500;
  text-shadow: 1px 1px 6px rgba(255, 255, 255, 0.8);
  
}

</style>
