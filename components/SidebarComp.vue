<template>
    <div class="sidebar fixed white-black h-4rem z-20
                flex flex-col justify-between shadow-lg bg-sky-950 transition-all duration-100 ease-in-out
                top-16 left-0" 
                :style="{width: sidebarWidth}">
                
        <!-- Top Controls -->
        <Transition name="fade">
          <div v-if="!collapsed" class="space-y-8 mt-8">
            
            <button @click="toggleInfo" class="sidebar-but" :class="{ 'active-border': inInfo }"> 
              <UTooltip text="Info" :popper="{ placement: 'right' }">
                <Icon class="sidebar-icon" name="uil:info-circle"/>
              </UTooltip>
            </button>
            
            <button v-if="user" @click="toggleEdit" class="sidebar-but" :class="{ 'active-border': inEdit }"> 
              <UTooltip text="Editační mód" :popper="{ placement: 'right' }">
                <Icon  class="sidebar-icon" name="uil:edit"/> 
              </UTooltip>
            </button>
            
            <button @click="copyToClipboard" class="sidebar-but">
              <UTooltip text="Zkopírovat odkaz" :popper="{ placement: 'right' }">
                <Icon class="sidebar-icon" name="uil:share"/>
              </UTooltip>
            </button>
            
            <button v-if="user" @click="toggleSettings" class="sidebar-but" :class="{ 'active-border': inSettings }"> 
              <UTooltip text="Nastavení" :popper="{ placement: 'right' }">
                <Icon class="sidebar-icon" name="uil:setting"/>
              </UTooltip>
            </button>
            
            <button v-if="inEdit" class="sidebar-but">
              <UTooltip text="Přidat novou událost" :popper="{ placement: 'right' }">
                <Icon  class="sidebar-icon" name="uil:plus-circle"/>
              </UTooltip>
            </button>

          </div>
        </Transition>

        <!-- Fixed position collapse button wrapper -->
        <div class="absolute bottom-0 left-0 right-0 px-2 mb-14 z-60">
          <span class="bg-sky-950 hover:bg-sky-900 rounded-xl cursor-pointer flex justify-center content-center
                    transition-all duration-100 ease-in-out"
                    
                :class="{ 'w-full': !collapsed, 'w-12 mx-auto': collapsed }"
                >
            <button @click="toggleSidebar" v-if="collapsed">
              <Icon class="sidebar-icon size-12" name="uil:list-ul"/>
            </button>
            <button @click="toggleSidebar" v-else>
              <Icon class="sidebar-icon size-12" name="uil:list-ui-alt"/>
            </button>
          </span>
        </div>
        <UNotifications/>
    </div>
</template>

<script setup>
import { collapsed, toggleSidebar, sidebarWidth, inEdit, toggleEdit, toggleInfo, toggleSettings, inSettings, inInfo } from '../composables/state';
import { useRoute } from 'vue-router';

const toast = useToast()
const user = useSupabaseUser()
const route = useRoute()
let link = '';
if (process.client) {
  // Access window only on the client-side
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
</script>

<style>
   /* Define the fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.05s ease-in-out; /* Adjust duration as needed */
}

.fade-enter-from, .fade-leave-to {
  opacity: 0; /* Start/End state for fade */
}

.active-border {
  outline: 4px solid #4CAF50; /* Green outline */
  outline-offset: 2px; /* Space between the outline and the button */
}
</style>