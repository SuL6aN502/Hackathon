// tailwind.config.js
const { addDynamicIconSelectors } = require("@iconify/tailwind");

module.exports = {
  content: ["./src/**/*.{jsx,}"],
  theme: {
    extend: {},
  },
  plugins: [addDynamicIconSelectors()],
};
