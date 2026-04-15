import { createContext, useContext } from "react"
import { useAuth } from "@/features/auth/hooks/use-auth"

type User = {
	id: string
	email: string
}

type AuthContextValue = {
	isAuthenticated: boolean
	isLoading: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

type Props = { children: React.ReactNode }

export function AuthProvider({ children }: Props) {
	const auth = useAuth()

	return (
		<AuthContext.Provider value={auth}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuthContext(): AuthContextValue {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider")
	}

	return context
}
