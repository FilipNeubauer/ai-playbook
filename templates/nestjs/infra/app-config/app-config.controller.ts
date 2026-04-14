import { Controller, Get, Query, BadRequestException } from "@nestjs/common"
import { AppConfigService } from "./app-config.service"
import type { Platform, VersionCheckResponse } from "./types/app-config.types"

@Controller("api/app-config")
export class AppConfigController {
	constructor(private readonly appConfigService: AppConfigService) {}

	@Get("version-check")
	async versionCheck(
		@Query("platform") platform: string,
		@Query("version") version: string,
	): Promise<VersionCheckResponse> {
		if (!platform || !["ios", "android"].includes(platform)) {
			throw new BadRequestException("platform must be 'ios' or 'android'")
		}

		if (!version) {
			throw new BadRequestException("version is required")
		}

		return this.appConfigService.checkVersion(platform as Platform, version)
	}
}
