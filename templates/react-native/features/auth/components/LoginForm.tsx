import { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native"

type LoginFormProps = {
	onLogin: (email: string, password: string) => Promise<void>
}

export function LoginForm({ onLogin }: LoginFormProps) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit() {
		setError(null)
		setIsLoading(true)

		try {
			await onLogin(email, password)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<View className="flex-1 justify-center px-6">
			<Text className="text-2xl font-bold text-center mb-8">Sign In</Text>

			{error && (
				<View className="bg-red-100 rounded-lg p-3 mb-4">
					<Text className="text-red-700 text-center">{error}</Text>
				</View>
			)}

			<TextInput
				className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
				autoComplete="email"
			/>

			<TextInput
				className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				autoComplete="password"
			/>

			<TouchableOpacity
				className={`rounded-lg py-3 items-center ${isLoading ? "bg-blue-400" : "bg-blue-600"}`}
				onPress={handleSubmit}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator color="white" />
				) : (
					<Text className="text-white font-semibold text-base">Sign In</Text>
				)}
			</TouchableOpacity>
		</View>
	)
}
