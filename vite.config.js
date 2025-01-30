import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,   // Allow network access
    port: 3333    // Set the correct port
  }
});
