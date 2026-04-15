// [GQL]
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { AuthService } from "../services/auth.service"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { CurrentUser } from "../decorators/current-user.decorator"
import { AuthTokenPairOutput } from "../models/auth-token-pair.output"
import { LoginInputModel } from "../models/login.input"
import type { JwtPayload } from "../types/auth.types"

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthTokenPairOutput)
	async login(
		@Args("input") input: LoginInputModel,
		@Context() ctx: { res: Response },
	): Promise<AuthTokenPairOutput> {
		const tokens = await this.authService.login(input)

		// Set refresh token as httpOnly cookie for web clients
		;(ctx.res as any).cookie("refresh_token", tokens.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		return tokens
	}

	@Mutation(() => AuthTokenPairOutput)
	async refreshTokens(
		@Args("refreshToken") refreshToken: string,
	): Promise<AuthTokenPairOutput> {
		return this.authService.refresh(refreshToken)
	}

	@Mutation(() => Boolean)
	@UseGuards(JwtAuthGuard)
	async logout(@CurrentUser() user: JwtPayload): Promise<boolean> {
		await this.authService.logout(user.sub)
		return true
	}
}
