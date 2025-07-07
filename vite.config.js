// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pubg121205.github.io/', // đổi nếu repo GitHub của bạn có tên khác
});
