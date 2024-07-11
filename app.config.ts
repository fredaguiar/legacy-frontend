import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'legacy-frontend',
  slug: 'legacy-frontend',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.fredaguiar.legacyfrontend',
    googleServicesFile: './android/app/google-services.json',
    permissions: [],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-secure-store'],
  extra: {
    eas: {
      projectId: 'c1658afe-4a74-4c36-902f-b211f963f010',
    },
  },
});
