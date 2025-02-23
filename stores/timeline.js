import { defineStore } from 'pinia';

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    topItems: [],
    bottomItems: [],
  }),
  actions: {
    setTopItems(items) {
      this.topItems = items;
    },
    setBottomItems(items) {
      this.bottomItems = items;
    },
  },
});