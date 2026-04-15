import { ExpoConfig, ConfigContext } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "__project__",
	slug: "__project__",
	version: "1.0.0",
	orientation: "portrait",
	scheme: "__project__",
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		bundleIdentifier: "com.__project__",
		associatedDomains: ["applinks:__project__.example.com"],
	},
	android: {
		adaptiveIcon: {
			backgroundColor: "#ffffff",
		},
		package: "com.__project__",
		intentFilters: [
			{
				action: "VIEW",
				autoVerify: true,
				data: [
					{
						scheme: "https",
						host: "__project__.example.com",
						pathPrefix: "/",
					},
				],
				category: ["BROWSABLE", "DEFAULT"],
			},
		],
	},
	plugins: ["expo-router", "react-native-reanimated", "react-native-keyboard-controller"],
})
