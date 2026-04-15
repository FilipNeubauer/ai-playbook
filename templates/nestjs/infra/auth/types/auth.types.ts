export type JwtPayload = {
	sub: string
	email: string
}

export type TokenPair = {
	accessToken: string
	refreshToken: string
}

export type LoginInput = {
	email: string
	password: string
}
