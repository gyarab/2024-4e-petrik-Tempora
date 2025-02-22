<template>
  <div class="editor-container" :class="{ 'is-focused': isFocused }">
    <QuillEditor
      v-model:content="content"
      :toolbar="[
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['link', 'formula'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['clean']
      ]"
      contentType="html"
      theme="snow"
      class="editor dark:text-white"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'

if (process.client) {
  window.katex = katex
}

const isFocused = ref(false)
  
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>
  
  <style>
  .editor-container .ql-toolbar {
    display: none;
    background-color: white;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .editor-container.is-focused .ql-toolbar {
    display: block;
  }
  
  .editor {
    min-height: 100px;  /* Minimum height */
    margin-bottom: 1rem;
    background-color: white;
  }
  
  .ql-container.ql-snow {
    border-radius: 0.375rem;
    height: auto !important;  /* Override Quill's default fixed height */
  }
  
  .ql-container .ql-editor {
    min-height: 100px;
    height: auto;
    max-height: none;
    overflow: visible;
  }
  
  .editor-container.is-focused .ql-container.ql-snow {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  /* Dark mode for toolbar */
  .dark .editor-container .ql-toolbar {
    background-color: rgb(39 39 42);
    border-color: rgb(63 63 70);
  }

  .dark .ql-toolbar .ql-stroke {
    stroke: white;
  }

  .dark .ql-toolbar .ql-fill {
    fill: white;
  }

  .dark .ql-toolbar .ql-picker {
    color: white;
  }

  /* Editor container dark mode */
  .dark .editor {
    background-color: rgb(39 39 42);
    color: white;
  }

  .dark .ql-container.ql-snow {
    border-color: rgb(63 63 70);
  }

  .dark .ql-editor.ql-blank::before {
    color: rgb(161 161 170);
  }

  /* Formula editor dark mode */
  .dark .ql-snow .ql-tooltip {
    background-color: rgb(39 39 42);
    color: white;
    border-color: rgb(63 63 70);
  }

  .dark .ql-snow .ql-tooltip input[type=text] {
    background-color: rgb(63 63 70);
    color: white;
    border-color: rgb(82 82 91);
  }

  /* Picker options dark mode */
  .dark .ql-snow .ql-picker-options {
    background-color: rgb(39 39 42);
    border-color: rgb(63 63 70);
  }

  .dark .ql-snow .ql-picker-item {
    color: rgb(255, 255, 255);
  }

  .dark .ql-snow .ql-picker-item:hover {
    background-color: rgb(63 63 70);
  }

  /* Hover effect for pickers */
.dark .ql-toolbar .ql-picker:hover,
.dark .ql-toolbar .ql-picker-label:hover {
  background-color: rgb(63 63 70); /* Slightly lighter hover effect */
  color: white;
}

.dark .ql-toolbar button:hover,
.dark .ql-toolbar button:focus {
  background-color: rgb(63 63 70); /* Slightly lighter hover effect */
}
  </style>