import{ ref, computed } from 'vue'

export const collapsed = ref(false);
    export const toggleSidebar = () => (collapsed.value = !collapsed.value);

    export const SIDEBAR_WIDTH = 60;
    export const SIDEBAR_WIDTH_COLLAPSED = 0;
    export const sidebarWidth = computed(
        () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED:SIDEBAR_WIDTH}px`
    )

    // State for toggles
export const inEdit = ref(false);
export const inSettings = ref(false);
export const inInfo = ref(false);

// Functions to toggle each state
export const toggleEdit = () => {
  inEdit.value = !inEdit.value; // Toggle inEdit
  if (inEdit.value) {
    inSettings.value = false;
    inInfo.value = false; // Deactivate others
  }
};

export const toggleSettings = () => {
  inSettings.value = !inSettings.value; // Toggle inSettings
  if (inSettings.value) {
    inEdit.value = false;
    inInfo.value = false; // Deactivate others
  }
};

export const toggleInfo = () => {
  inInfo.value = !inInfo.value; // Toggle inInfo
  if (inInfo.value) {
    inEdit.value = false;
    inSettings.value = false; // Deactivate others
  }
};

export const falseAll = () => {
  inInfo.value = false;
  inEdit.value = false;
  inSettings.value = false;   
};