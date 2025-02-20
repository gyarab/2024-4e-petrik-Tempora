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
        class="editor"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
</template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import 'katex/dist/katex.min.css'
  
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
  </style>