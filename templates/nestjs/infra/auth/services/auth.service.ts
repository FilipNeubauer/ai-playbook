import { Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { eq } from "drizzle-orm"
import * as bcrypt from "bcrypt"
import { randomBytes, createHash } from "node:crypto"
import { DrizzleService } from "../../../libs/drizzle/services/drizzle.service"
import { EnvVariableService } from "../../../libs/common/services/env-variable.service"
import { EnvVariable } from "../../../libs/common/constants/env-variable.constants"
import { refreshTokenTable } from "../../../libs/drizzle/db/schemas/refresh-token.schema"
import { AUTH_CONSTANTS } from "../constants/auth.constants"
import type { JwtPayload, TokenPair, LoginInput } from "../types/auth.types"

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		private readonly jwt: JwtService,
		private readonly drizzle: DrizzleService,
		private readonly env: EnvVariableService,
	) {}

	async login(input: LoginInput): Promise<TokenPair> {
		// TODO: Replace with actual user lookup from your users table
		// const user = await this.drizzle.db.select().from(usersTable).where(eq(usersTable.email, input.email)).limit(1)
		// if (!user[0]) {
		// 	this.logger.warn(`Login failed: user not found for email=${input.email}`)
		// 	throw new UnauthorizedException("Invalid credentials")
		// }
		// const isPasswordValid = await bcrypt.compare(input.password, user[0].passwordHash)
		// if (!isPasswordValid) {
		// 	this.logger.warn(`Login failed: invalid password for email=${input.email}`)
		// 	throw new UnauthorizedException("Invalid credentials")
		// }
		// const payload: JwtPayload = { sub: user[0].id, email: user[0].email }

		throw new Error("Implement user lookup and password validation")

		// const tokens = await this.generateTokens(payload)
		// await this.storeRefreshToken(payload.sub, tokens.refreshToken)
		// return tokens
	}

	async refresh(refreshToken: string): Promise<TokenPair> {
		const tokenHash = this.hashToken(refreshToken)

		const stored = await this.drizzle.db
			.select()
			.from(refreshTokenTable)
			.where(eq(refreshTokenTable.tokenHash, tokenHash))
			.limit(1)

		if (!stored[0]) {
			this.logger.warn("Refresh failed: token not found")
			throw new UnauthorizedException("Invalid refresh token")
		}

		if (stored[0].expiresAt < new Date()) {
			this.logger.warn(`Refresh failed: token expired for userId=${stored[0].userId}`)
			await this.drizzle.db
				.delete(refreshTokenTable)
				.where(eq(refreshTokenTable.tokenHash, tokenHash))
			throw new UnauthorizedException("Refresh token expired")
		}

		// Delete the used refresh token (rotation)
		await this.drizzle.db
			.delete(refreshTokenTable)
			.where(eq(refreshTokenTable.tokenHash, tokenHash))

		let payload: JwtPayload
		try {
			payload = this.jwt.verify<JwtPayload>(refreshToken, {
				secret: this.env.get(EnvVariable.JwtSecret),
			})
		} catch {
			this.logger.warn("Refresh failed: token verification error")
			throw new UnauthorizedException("Invalid refresh token")
		}

		const newPayload: JwtPayload = { sub: payload.sub, email: payload.email }
		const tokens = await this.generateTokens(newPayload)
		await this.storeRefreshToken(newPayload.sub, tokens.refreshToken)

		return tokens
	}

	async logout(userId: string): Promise<void> {
		await this.drizzle.db
			.delete(refreshTokenTable)
			.where(eq(refreshTokenTable.userId, userId))

		this.logger.log(`User logged out: userId=${userId}`)
	}

	private async generateTokens(payload: JwtPayload): Promise<TokenPair> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwt.signAsync(payload, {
				expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRATION,
			}),
			this.jwt.signAsync(payload, {
				expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRATION,
			}),
		])

		return { accessToken, refreshToken }
	}

	private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
		const tokenHash = this.hashToken(refreshToken)
		const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRATION_MS)

		await this.drizzle.db.insert(refreshTokenTable).values({
			userId,
			tokenHash,
			expiresAt,
		})
	}

	private hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex")
	}
}
