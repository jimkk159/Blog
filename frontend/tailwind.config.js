module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          '800': '#27374D',
          '400': '#526D82',
          '200': '#9DB2BF',
          '100': '#DDE6ED',
        }
        
      },
    },  

  },
  variants: {
    extend: {},
  },
  plugins: [],
};
