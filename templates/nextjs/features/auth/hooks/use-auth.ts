"use client"

import { useState, useEffect, useCallback } from "react"

type User = {
	id: string
	email: string
	name?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [user, setUser] = useState<User | null>(null)
	const [accessToken, setAccessToken] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/api/auth/refresh`, {
				method: "POST",
				credentials: "include",
			})

			if (!res.ok) {
				throw new Error("Refresh failed")
			}

			const data = await res.json()
			setAccessToken(data.accessToken)
			setUser(data.user)
			setIsAuthenticated(true)
		} catch {
			setAccessToken(null)
			setUser(null)
			setIsAuthenticated(false)
		}
	}, [])

	const login = useCallback(async (email: string, password: string) => {
		setIsLoading(true)
		try {
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			})

			if (!res.ok) {
				const error = await res.json().catch(() => ({}))
				throw new Error(error.message ?? "Login failed")
			}

			const data = await res.json()
			setAccessToken(data.accessToken)
			setUser(data.user)
			setIsAuthenticated(true)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			await fetch(`${API_URL}/api/auth/logout`, {
				method: "POST",
				credentials: "include",
			})
		} finally {
			setAccessToken(null)
			setUser(null)
			setIsAuthenticated(false)
		}
	}, [])

	useEffect(() => {
		const checkAuth = async () => {
			setIsLoading(true)
			await refresh()
			setIsLoading(false)
		}

		checkAuth()
	}, [refresh])

	return { isAuthenticated, isLoading, user, login, logout, accessToken }
}
