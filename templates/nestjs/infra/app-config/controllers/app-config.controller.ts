import { Controller, Get, Query, BadRequestException, Logger } from "@nestjs/common"
import { AppConfigService } from "../services/app-config.service"
import type { Platform, VersionCheckResponse } from "../types/app-config.types"

@Controller("api/app-config")
export class AppConfigController {
	private readonly logger = new Logger(AppConfigController.name)

	constructor(private readonly appConfigService: AppConfigService) {}

	@Get("version-check")
	async versionCheck(
		@Query("platform") platform: string,
		@Query("version") version: string,
	): Promise<VersionCheckResponse> {
		if (!platform || !["ios", "android"].includes(platform)) {
			this.logger.warn(`Invalid platform received: platform=${platform}, version=${version}`)
			throw new BadRequestException("platform must be 'ios' or 'android'")
		}

		if (!version) {
			this.logger.warn(`Missing version: platform=${platform}`)
			throw new BadRequestException("version is required")
		}

		return this.appConfigService.checkVersion(platform as Platform, version)
	}
}
