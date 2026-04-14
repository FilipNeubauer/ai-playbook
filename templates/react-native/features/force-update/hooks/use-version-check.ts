import { useEffect, useState } from "react"
import { Platform } from "react-native"
import Constants from "expo-constants"

type VersionCheckResult = {
	forceUpdate: boolean
	storeUrl: string | undefined
	loading: boolean
	error: string | undefined
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"

export function useVersionCheck(): VersionCheckResult {
	const [result, setResult] = useState<VersionCheckResult>({
		forceUpdate: false,
		storeUrl: undefined,
		loading: true,
		error: undefined,
	})

	useEffect(() => {
		const checkVersion = async () => {
			const version = Constants.expoConfig?.version
			const platform = Platform.OS

			if (!version || (platform !== "ios" && platform !== "android")) {
				setResult((prev) => ({ ...prev, loading: false }))
				return
			}

			try {
				const response = await fetch(
					`${API_URL}/api/app-config/version-check?platform=${platform}&version=${version}`,
				)

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`)
				}

				const data = await response.json()
				setResult({
					forceUpdate: data.forceUpdate,
					storeUrl: data.storeUrl,
					loading: false,
					error: undefined,
				})
			} catch (err) {
				setResult({
					forceUpdate: false,
					storeUrl: undefined,
					loading: false,
					error: err instanceof Error ? err.message : "Version check failed",
				})
			}
		}

		checkVersion()
	}, [])

	return result
}
