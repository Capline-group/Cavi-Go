import {defineConfig,mergeConfig} from 'vite';
import base from './vite.config';
export default defineConfig(async env=>mergeConfig(typeof base==='function'?await base(env):await base,{build:{rollupOptions:{input:{app:'index.html',admin:'admin.html',driver:'driver.html'}}}}));
