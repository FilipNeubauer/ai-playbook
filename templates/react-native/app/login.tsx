import { View } from "react-native"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { useAuthContext } from "@/providers/AuthProvider"

export default function LoginScreen() {
	const { login } = useAuthContext()

	return (
		<View className="flex-1 bg-white">
			<LoginForm onLogin={login} />
		</View>
	)
}
