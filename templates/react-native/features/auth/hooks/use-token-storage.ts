import * as SecureStore from "expo-secure-store"

const ACCESS_TOKEN_KEY = "auth_access_token"
const REFRESH_TOKEN_KEY = "auth_refresh_token"

export function useTokenStorage() {
	async function getAccessToken(): Promise<string | null> {
		return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
	}

	async function getRefreshToken(): Promise<string | null> {
		return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
	}

	async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)
		await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
	}

	async function clearTokens(): Promise<void> {
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
		await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
	}

	return {
		getAccessToken,
		getRefreshToken,
		setTokens,
		clearTokens,
	}
}
