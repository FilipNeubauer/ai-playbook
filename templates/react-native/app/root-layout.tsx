import "../styles/global.css"

import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useFonts } from "expo-font"
import { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { Providers } from "@/providers/Providers"
import { ForceUpdateProvider } from "@/providers/ForceUpdateProvider"
import { AuthProvider } from "@/providers/AuthProvider"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Inter: require("../assets/fonts/Inter-Regular.ttf"),
		"Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
		"Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
		"Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
	})

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<KeyboardProvider>
				<BottomSheetModalProvider>
					<Providers>
						<AuthProvider>
							<ForceUpdateProvider>
								<Stack screenOptions={{ headerShown: false }} />
							</ForceUpdateProvider>
						</AuthProvider>
					</Providers>
				</BottomSheetModalProvider>
			</KeyboardProvider>
		</GestureHandlerRootView>
	)
}
