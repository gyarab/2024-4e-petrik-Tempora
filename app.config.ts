export default defineAppConfig({
    ui: {
      tokens: {
        colors: {
          primary: {
            DEFAULT: 'sky-700',
            hover: 'sky-600',
            dark: {
              DEFAULT: 'sky-300',
              hover: 'sky-400',
            },
          },
        },
      },
      button: {
        default: {
          color: 'primary', // This now uses our overridden primary color
          size: 'sm',
          class: 'rounded-md text-sm border-2 border-black text-white dark:text-black px-3 py-2 font-medium inline-flex items-center',
        },
      },
    },
  });
  