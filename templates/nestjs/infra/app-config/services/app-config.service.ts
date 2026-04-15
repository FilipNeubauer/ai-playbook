import { Injectable, Logger } from "@nestjs/common"
import { eq } from "drizzle-orm"
import { lt, valid } from "semver"
import { DrizzleService } from "../../../libs/drizzle/services/drizzle.service"
import { appConfigTable } from "../../../libs/drizzle/db/schemas/app-config.schema"
import {
	AppConfigKey,
	PLATFORM_STORE_URL_KEY,
	PLATFORM_VERSION_KEY,
} from "../constants/app-config.constants"
import type { Platform, VersionCheckResponse } from "../types/app-config.types"

@Injectable()
export class AppConfigService {
	private readonly logger = new Logger(AppConfigService.name)

	constructor(private readonly drizzle: DrizzleService) {}

	async getConfig(key: AppConfigKey): Promise<string | undefined> {
		const rows = await this.drizzle.db
			.select({ value: appConfigTable.value })
			.from(appConfigTable)
			.where(eq(appConfigTable.key, key))
			.limit(1)

		return rows[0]?.value
	}

	async checkVersion(platform: Platform, version: string): Promise<VersionCheckResponse> {
		const enabledRaw = await this.getConfig(AppConfigKey.ForceUpdateEnabled)
		if (enabledRaw === "false") {
			return { forceUpdate: false, storeUrl: undefined, minVersion: undefined, currentVersion: version }
		}

		const versionKey = PLATFORM_VERSION_KEY[platform]
		const storeUrlKey = PLATFORM_STORE_URL_KEY[platform]

		if (!versionKey || !storeUrlKey) {
			this.logger.warn(`Unknown platform: ${platform}`)
			return { forceUpdate: false, storeUrl: undefined, minVersion: undefined, currentVersion: version }
		}

		const minVersion = await this.getConfig(versionKey)
		const storeUrl = await this.getConfig(storeUrlKey)

		if (!minVersion || !valid(minVersion)) {
			this.logger.warn(`Invalid or missing min version for platform=${platform}`)
			return { forceUpdate: false, storeUrl, minVersion, currentVersion: version }
		}

		if (!valid(version)) {
			this.logger.warn(`Invalid app version received: ${version}`)
			return { forceUpdate: false, storeUrl, minVersion, currentVersion: version }
		}

		const forceUpdate = lt(version, minVersion)

		return { forceUpdate, storeUrl, minVersion, currentVersion: version }
	}
}
