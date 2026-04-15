import { LoginForm } from "@/features/auth/components/LoginForm"

export default function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-6">
				<h1 className="text-2xl font-bold">Sign in</h1>
				<LoginForm />
			</div>
		</div>
	)
}
