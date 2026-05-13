import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig & { bundledWebRuntime: boolean } = {
  appId: 'com.blockmancer.dungeon',
  appName: 'Blockmancer Dungeon',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
