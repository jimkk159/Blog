module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          800: "#27374D",
          400: "#526D82",
          200: "#9DB2BF",
          100: "#DDE6ED",
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
    fontFamily: {
      akaya: ["Akaya Telivigala", "cursive"],
      "dela-gothic-one": ["Dela Gothic One", "cursive"],
      "open-sans": ["Open Sans", "sans-serif"],
      raleway: ["Raleway", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      "roboto-condensed": ["Roboto Condensed", "sans-serif"],
      satify: ["Satisfy", "cursive"],
      kanit:['Kanit', "sans-serif"],
      "source-serif-pro":['Source Serif Pro', "serif"]
    },
  },
};
