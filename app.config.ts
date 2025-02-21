export default defineAppConfig({
    ui: {
      tokens: {
        colors: {
          primary: 'sky',
        },
      },
      button: {
        default: {
          color: 'sky', // This now uses our overridden primary color
          size: 'sm',
          class: 'rounded-md text-sm border-2 border-black text-white dark:text-black px-3 py-2 font-medium inline-flex items-center',
          hover: 'hover:bg-sky-600'
        },
      },
    },
  });
  