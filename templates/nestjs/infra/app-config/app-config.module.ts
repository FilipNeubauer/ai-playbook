import { Module } from "@nestjs/common"
import { AppConfigService } from "./services/app-config.service"
import { AppConfigController } from "./controllers/app-config.controller"

@Module({
	controllers: [AppConfigController],
	providers: [AppConfigService],
	exports: [AppConfigService],
})
export class AppConfigModule {}
