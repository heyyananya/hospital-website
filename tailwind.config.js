/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./admin-dashboard.html",
    "./doctor-dashboard.html",
    "./patient-dashboard.html",
    "./receptionist-dashboard.html",
    "./portal-login.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        secondary: "#00F0FF",
        dark: "#0f172a",
        light: "#f8fafc",
        "status-available": "#10b981",
        "status-busy": "#ef4444",
        "status-late": "#f59e0b",
        "status-left": "#64748b"
      }
    },
  },
  plugins: [],
}
