// 开发用别名与构建配置。
// 约定：所有交互脚本都是 ES module，按需动态 import，便于后续拆分 chunk。
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 监听所有网卡，方便用手机/平板连同一局域网内的地址调试
    host: '0.0.0.0',
    port: 5678,
    open: false,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: true,
  },
});
