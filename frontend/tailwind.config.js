/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        1200: "1248px",
        "w-xmd": "420px",
      },

      fontFamily: {
        primary: "General Sans", 
        secondary: "sans-serif"
      },

      fontSize: {
        xs: "12px",
        9: "9px",
        12: "12px",
        32: "32px",
        40: "40px",
      },

      colors: {
        primary: "#1A56DB",
        primary2: "#F0F6FA",
        primary3: "#9DC5DB",
        secondary1: "#212121",
        secondary2: "#424242",
        secondary3: "#616161",
        secondary4: "#757575",
        secondary5: "#EDEEF0",
        secondary6: "#D9D9D9",
        secondary7: "#bdbdbd",
        tertiary: "#48B92F",
        tertiary2: "#F4FBF3",
        yellow: "#FDD835",
      },

      letterSpacing: {
        wide: "1px",
      },

      padding: {
        13: "14",
        14: "14px",
      },

      lineHeight: {
        58: "58px",
        46: "46px",
      },

      boxShadow: {
        navbar: "0px 4px 8px rgba(0, 0, 0, 0.08)",
        card: "0px 8px 16px rgba(0, 0, 0, 0.16)",
      },

      spacing: {
        9.5: "38px",
        7.5: "30px",
        "pdf-w": "650px",
        "pdf-h": "920px",
        "sidebar": "730px",
        "test":"886px"
      },
    },
  },
  plugins: [],
};

