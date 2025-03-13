import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// get environment variables
import dotenv from 'dotenv';
dotenv.config();

const HOSTED = process.env.HOSTED || false;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: HOSTED ? '/frontend/' : '/',
  server: {
    port: 5000, // You can change this if needed
  },
});
