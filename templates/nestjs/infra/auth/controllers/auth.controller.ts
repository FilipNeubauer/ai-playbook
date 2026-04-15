import { Controller, Post, Body, UseGuards, Res, Logger } from "@nestjs/common"
import type { Response } from "express"
import { AuthService } from "../services/auth.service"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { CurrentUser } from "../decorators/current-user.decorator"
import { AUTH_CONSTANTS } from "../constants/auth.constants"
import type { JwtPayload, TokenPair, LoginInput } from "../types/auth.types"

@Controller("api/auth")
export class AuthController {
	private readonly logger = new Logger(AuthController.name)

	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async login(@Body() input: LoginInput): Promise<TokenPair> {
		this.logger.log(`Login attempt: email=${input.email}`)
		return this.authService.login(input)
	}

	@Post("refresh")
	async refresh(
		@Body("refreshToken") refreshToken: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<TokenPair> {
		this.logger.log("Token refresh attempt")
		const tokens = await this.authService.refresh(refreshToken)

		res.cookie("refreshToken", tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRATION_MS,
		})

		return tokens
	}

	@Post("logout")
	@UseGuards(JwtAuthGuard)
	async logout(@CurrentUser() user: JwtPayload): Promise<void> {
		this.logger.log(`Logout: userId=${user.sub}`)
		return this.authService.logout(user.sub)
	}
}
