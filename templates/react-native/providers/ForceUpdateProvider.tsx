import { useEffect, useRef } from "react"
import { AppState, type AppStateStatus } from "react-native"
import { useVersionCheck } from "@/features/force-update/hooks/use-version-check"
import { ForceUpdateModal } from "@/features/force-update/components/ForceUpdateModal"

type Props = {
	children: React.ReactNode
}

export function ForceUpdateProvider({ children }: Props) {
	const { forceUpdate, storeUrl, loading } = useVersionCheck()
	const appState = useRef(AppState.currentState)

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				// TODO: re-trigger version check when app comes to foreground
			}
			appState.current = nextAppState
		}

		const subscription = AppState.addEventListener("change", handleAppStateChange)
		return () => subscription.remove()
	}, [])

	if (loading) {
		return null
	}

	return (
		<>
			{children}
			{forceUpdate && storeUrl ? <ForceUpdateModal storeUrl={storeUrl} /> : null}
		</>
	)
}
