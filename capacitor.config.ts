import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.boondock.app',
  appName: 'Boondock',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
