"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/features/auth/hooks/use-auth"

type User = {
	id: string
	email: string
	name?: string
}

type AuthContextValue = {
	isAuthenticated: boolean
	isLoading: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	accessToken: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider")
	}
	return context
}

type Props = {
	children: ReactNode
}

export function AuthProvider({ children }: Props) {
	const auth = useAuth()

	return (
		<AuthContext.Provider value={auth}>
			{children}
		</AuthContext.Provider>
	)
}
