/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {  fontFamily: {
      sans: ['Poppins', 'Inter', 'sans-serif'],
    },  gray: {
      800: "#1f1f1f", // Dark background for elements
      900: "#121212", // Dark background for sidebar
    },
    blue: {
      600: "#3182ce", // Oceanic blue for hover and active buttons
      700: "#2b6cb0", // Slightly darker blue for active states
    },
    red: {
      400: "#fc8181", // Light red for chat button
      600: "#e53e3e", // Stronger red for active state
    },
    green: {
      400: "#48bb78", // Light green for voice chat button
      600: "#38a169", // Darker green for active state
    },},
  },
  plugins: [],
};
