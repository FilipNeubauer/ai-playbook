import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '__project__',
  slug: '__project__',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: '__project__',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.__project__',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
    },
    package: 'com.__project__',
  },
  plugins: ['expo-router'],
});
