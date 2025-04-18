<template>
    <div class="sidebar fixed white-black h-4rem z-20
                flex flex-col justify-between shadow-lg bg-sky-950 transition-all duration-100 ease-in-out
                top-16 right-0" 
                :style="{width: sidebarWidth}">
                
        <!-- Top Controls -->
        <Transition name="fade">
          <div v-if="!collapsed" class="lg:space-y-8 lg:mt-8 md:space-y-2 md:mt-2"  >
            
            <button @click="handleInfoToggle" class="sidebar-but" :class="{ 'active-border': inInfo }"> 
              <UTooltip text="Info" :popper="{ placement: 'left' }">
                <Icon class="sidebar-icon" name="uil:info-circle"/>
              </UTooltip>
            </button>
            
            <button v-if="user" @click="toggleEdit" class="sidebar-but" :class="{ 'active-border': inEdit }"> 
              <UTooltip text="Editační mód" :popper="{ placement: 'left' }">
                <Icon  class="sidebar-icon" name="uil:edit"/> 
              </UTooltip>
            </button>
            
            <button @click="copyToClipboard" class="sidebar-but">
              <UTooltip text="Zkopírovat odkaz" :popper="{ placement: 'left' }">
                <Icon class="sidebar-icon" name="uil:share"/>
              </UTooltip>
            </button>
            
            <button v-if="user" @click="handleSettingsToggle" class="sidebar-but" :class="{ 'active-border': inSettings }"> 
              <UTooltip text="Nastavení" :popper="{ placement: 'left' }">
                <Icon class="sidebar-icon" name="uil:setting"/>
              </UTooltip>
            </button> 
            
            <button v-if="user" @click="toggleBookmarkState" class="sidebar-but"> 
              <UTooltip v-if="!isBookmarked" text="Uložit záložku" :popper="{ placement: 'left' }">
                <Icon class="sidebar-icon" name="heroicons:bookmark"/>
              </UTooltip>
              <UTooltip v-else text="Zrušit záložku" :popper="{ placement: 'left' }">
                <Icon class="sidebar-icon" name="heroicons:bookmark-solid"/>
              </UTooltip>
            </button>

            <button v-if="inEdit" class="sidebar-but" @click="addEvent">
              <UTooltip text="Přidat novou událost" :popper="{ placement: 'left' }">
                <Icon  class="sidebar-icon" name="uil:plus-circle"/>
              </UTooltip>
            </button>

            <button @click="toggleTimelineDarkMode" class="sidebar-but">
              <UTooltip text="Přepnout barevný režim" :popper="{ placement: 'left' }">
                <Icon 
                  class="sidebar-icon" 
                  :name="timelineDarkMode ? 'uil:brightness' : 'heroicons:moon'"
                />
              </UTooltip>
            </button>

          </div>
        </Transition>

        <!-- Fixed position collapse button wrapper -->
        <div class="absolute bottom-0 right-0 px-2 z-60 " >
          <span class="bg-sky-950 hover:bg-sky-900 rounded-xl cursor-pointer flex justify-center content-center
                    transition-all duration-100 ease-in-out"
                    
                :class="{ 'w-full': !collapsed, 'w-12 mx-auto': collapsed, 'mb-14': !inInfo && !inSettings,}"
                >
            <button @click="toggleSidebar" v-if="collapsed">
              <Icon class="sidebar-icon lg:size-12 md:size-8" name="uil:list-ul"/>
            </button>
            <button @click="toggleSidebar" v-else>
              <Icon class="sidebar-icon lg:size-12 md:size-8" name="uil:list-ui-alt"/>
            </button>
          </span>
        </div>
        <UNotifications/>
    </div>
  </template>

<script setup>
import { collapsed, toggleSidebar, sidebarWidth, inEdit, toggleEdit, inSettings, inInfo, timelineDarkMode, toggleTimelineDarkMode } from '../composables/state';
import { useRoute } from 'vue-router';
import { toggleBookmark, fetchBookmarkState } from "../composables/useSupabase";
import { fetchLastItemIdByLineId } from "../composables/supabaseItem";

const toast = useToast()
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()
const isBookmarked = ref(false);
const { id } = useRoute().params

let link = '';
if (process.client) {
  link = `${window.location.origin}${route.path}`;
}

function copyToClipboard() {
  try {
    navigator.clipboard.writeText(link)
    toast.add({
      title: 'Odkaz zkopírován',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 1000,
      pauseTimeoutOnHover: false,
    })
  } catch (error) {
    toast.add({
      title: 'Chyba při kopírování',
      icon: 'i-heroicons-x-circle',
      color: 'red',
      timeout: 1000,
      pauseTimeoutOnHover: false,
    })
  }
}


async function addEvent() {
  const lastItemId = await fetchLastItemIdByLineId(id);
  const newItemId = lastItemId + 1;
  router.push({ path: `/lines/${id}/${newItemId}`, query: { creatingNew: 'true' } });
}

async function updateBookmarkState() {
  isBookmarked.value = await fetchBookmarkState(id, user);
}

onMounted(() => {
  if(user.value) {
    updateBookmarkState();
  }
});


async function toggleBookmarkState() {
  try {
    isBookmarked.value = await toggleBookmark(id, user.value.id, isBookmarked.value);
    toast.add({
      title: isBookmarked.value ? "Záložka uložena" : "Záložka zrušena",
      icon: "i-heroicons-check-circle",
      color: "green",
      timeout: 1000,
    });
  } catch (error) {
    toast.add({
      title: "Chyba při ukládání záložky",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 1000,
    });
  }
}


const emit = defineEmits(['infoToggle', 'settingsToggle']);
  function handleInfoToggle(lineId) {
  emit('infoToggle', lineId);
}
function handleSettingsToggle(lineId) {
  emit('settingsToggle', lineId);
}
</script>

<style>
/* Define the fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.05s ease-in-out;
}

/* Start/End state for fade */
.fade-enter-from, .fade-leave-to {
  opacity: 0; 
}

.active-border {
  outline: 4px solid #4CAF50; 
  outline-offset: 2px;
}
</style>