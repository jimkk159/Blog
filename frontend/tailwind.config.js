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
        "self-red": "#FF0000",
        "self-pink": { 500: "#ec6090", 600: "#d55686" },
        "self-gray": "#666",
        "self-dark": "#1f2122",
        "self-dark-gray": "#27292a",
        "self-purple": "#510077",
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
    fontFamily: {
      akaya: ["Akaya Telivigala", "cursive"],
      "bree-serif": ["Bree Serif", "serif"],
      "dela-gothic-one": ["Dela Gothic One", "cursive"],
      "dm-serif-display": ["DM Serif Display", "serif"],
      "IBM-plex-serif": ["IBM Plex Serif", "serif"],
      "open-sans": ["Open Sans", "sans-serif"],
      "pt-serif": ["PT Serif", "serif"],
      raleway: ["Raleway", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      "roboto-condensed": ["Roboto Condensed", "sans-serif"],
      satify: ["Satisfy", "cursive"],
      kanit: ["Kanit", "sans-serif"],
      "source-serif-pro": ["Source Serif Pro", "serif"],
      teko: ["Teko", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
  },
};
