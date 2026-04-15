"use client"

import { AuthProvider } from "@/providers/AuthProvider"

type Props = {
	children: React.ReactNode
}

export function Providers({ children }: Props) {
	return (
		<AuthProvider>
			{children}
		</AuthProvider>
	)
}
