export type VersionCheckResponse = {
	forceUpdate: boolean
	storeUrl: string | undefined
	minVersion: string | undefined
	currentVersion: string
}

export type Platform = "ios" | "android"
