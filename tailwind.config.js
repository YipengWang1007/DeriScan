module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: ['bg-green-600', 'bg-red-600', 'bg-purple-600']
    }
  },
  
  theme: {
    extend: {
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover', 'focus'],
    }
  },
  plugins: [],
}
