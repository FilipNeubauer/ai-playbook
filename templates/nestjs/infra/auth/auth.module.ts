import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { EnvVariableService } from "../../libs/common/services/env-variable.service"
import { EnvVariable } from "../../libs/common/constants/env-variable.constants"
import { AuthService } from "./services/auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { AuthController } from "./controllers/auth.controller"
// [IF GraphQL] import { AuthResolver } from "./resolvers/auth.resolver"

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [EnvVariableService],
			useFactory: (env: EnvVariableService) => ({
				secret: env.get(EnvVariable.JwtSecret),
				signOptions: { expiresIn: "15m" },
			}),
		}),
	],
	providers: [
		AuthService,
		JwtStrategy,
		// [IF GraphQL] AuthResolver,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
