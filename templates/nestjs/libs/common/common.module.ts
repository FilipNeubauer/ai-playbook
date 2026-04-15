import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EnvVariableService } from "./services/env-variable.service"
// [IF GraphQL] import { DataloaderFactory } from "./factories/dataloader.factory"

@Global()
@Module({
	imports: [ConfigModule.forRoot()],
	providers: [
		EnvVariableService,
		// [IF GraphQL] DataloaderFactory,
	],
	exports: [
		EnvVariableService,
		// [IF GraphQL] DataloaderFactory,
	],
})
export class CommonModule {}
