import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { EnvVariableService } from "../../../libs/common/services/env-variable.service"
import { EnvVariable } from "../../../libs/common/constants/env-variable.constants"
import type { JwtPayload } from "../types/auth.types"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly env: EnvVariableService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: env.get(EnvVariable.JwtSecret),
		})
	}

	validate(payload: JwtPayload): JwtPayload {
		return payload
	}
}
