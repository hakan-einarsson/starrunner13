import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: '0.0.0.0', // Exponerar servern på alla nätverksgränssnitt
        port: 3000,      // Valfritt: Ange en port (standard är 5173)
    },
    base: './',
});
