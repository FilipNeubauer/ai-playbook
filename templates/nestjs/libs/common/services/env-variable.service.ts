import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EnvVariable } from "../constants/env-variable.constants"

@Injectable()
export class EnvVariableService {
	private readonly logger = new Logger(EnvVariableService.name)

	constructor(private readonly configService: ConfigService) {}

	get(key: EnvVariable): string {
		const value = this.getOptional(key)

		if (!value) {
			throw new Error(`Environment variable ${key} is not defined`)
		}

		return value
	}

	getOptional(key: EnvVariable): string | undefined {
		const value = this.configService.get<string>(key)

		if (!value) {
			this.logger.warn(`Environment variable ${key} is not defined`)
			return undefined
		}

		return value
	}
}
