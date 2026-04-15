"use client"

import { useState, type FormEvent } from "react"
import { useAuthContext } from "@/providers/AuthProvider"

export function LoginForm() {
	const { login, isLoading } = useAuthContext()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			await login(email, password)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed")
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
			{error && (
				<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
					{error}
				</div>
			)}

			<div className="flex flex-col gap-1.5">
				<label htmlFor="email" className="text-sm font-medium text-gray-700">
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="you@example.com"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="password" className="text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="********"
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</button>
		</form>
	)
}
