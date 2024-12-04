module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Adjust based on your folder structure
  theme: {
    extend: {
      colors: {
        blue: "#3C91E6",
        light: "#F9F9F9",
        gray: {
          300: "#D1D5DB",
          800: "#1F2937",
        },
        dark: "#342E37",
        red: "#DB504A",
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        'input[type="number"]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          'margin': '0',
        },
        'input[type="number"]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          'margin': '0',
        },
        'input[type="number"]': {
          '-moz-appearance': 'textfield',
        },
      });
    },
  ],};
