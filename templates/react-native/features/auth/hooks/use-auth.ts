import { useState, useEffect, useCallback } from "react"
import { useTokenStorage } from "./use-token-storage"

const API_URL = process.env.EXPO_PUBLIC_API_URL

type User = {
	id: string
	email: string
}

type UseAuthReturn = {
	isAuthenticated: boolean
	isLoading: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [user, setUser] = useState<User | null>(null)

	const { getAccessToken, getRefreshToken, setTokens, clearTokens } = useTokenStorage()

	const refresh = useCallback(async (): Promise<boolean> => {
		const refreshToken = await getRefreshToken()
		if (!refreshToken) return false

		try {
			const response = await fetch(`${API_URL}/api/auth/refresh`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken }),
			})

			if (!response.ok) return false

			const data = await response.json()
			await setTokens(data.accessToken, data.refreshToken)
			setUser(data.user)
			setIsAuthenticated(true)
			return true
		} catch {
			return false
		}
	}, [getRefreshToken, setTokens])

	const checkAuth = useCallback(async () => {
		setIsLoading(true)
		try {
			const accessToken = await getAccessToken()
			if (!accessToken) {
				const refreshed = await refresh()
				if (!refreshed) {
					setIsAuthenticated(false)
					setUser(null)
				}
				return
			}

			setIsAuthenticated(true)
		} catch {
			setIsAuthenticated(false)
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}, [getAccessToken, refresh])

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	async function login(email: string, password: string): Promise<void> {
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message ?? "Login failed")
		}

		const data = await response.json()
		await setTokens(data.accessToken, data.refreshToken)
		setUser(data.user)
		setIsAuthenticated(true)
	}

	async function logout(): Promise<void> {
		const accessToken = await getAccessToken()

		try {
			await fetch(`${API_URL}/api/auth/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			})
		} finally {
			await clearTokens()
			setUser(null)
			setIsAuthenticated(false)
		}
	}

	return {
		isAuthenticated,
		isLoading,
		user,
		login,
		logout,
	}
}
