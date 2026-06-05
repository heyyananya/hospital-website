import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin-dashboard.html'),
        login: resolve(__dirname, 'portal-login.html'),
        doctor: resolve(__dirname, 'doctor-dashboard.html'),
        doctor_space: resolve(__dirname, 'doctor dashboard.html'),
        patient: resolve(__dirname, 'patient-dashboard.html'),
        receptionist: resolve(__dirname, 'receptionist-dashboard.html')
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
