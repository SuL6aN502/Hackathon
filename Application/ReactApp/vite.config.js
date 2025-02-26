import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Hackathon/', // اضبط هذا ليتوافق مع اسم المستودع
});