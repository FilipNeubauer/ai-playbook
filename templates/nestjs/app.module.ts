import { Module } from "@nestjs/common"
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ZodValidationPipe } from "nestjs-zod"
import { CommonModule } from "./libs/common/common.module"
import { DrizzleModule } from "./libs/drizzle/drizzle.module"
import { __Domain__Module } from "./domain/__domain__/__domain__.module"
import { AuthModule } from "./infra/auth/auth.module"
import { BullmqModule } from "./infra/bullmq/bullmq.module"
import { AppConfigModule } from "./infra/app-config/app-config.module"
// [IF GraphQL] import { GraphqlModule } from './infra/graphql/graphql.module';
// [IF GraphQL] import { DataloaderModule } from './infra/dataloader/dataloader.module';
import { HealthcheckController } from "./infra/controllers/healthcheck.controller"
import { HttpExceptionFilter } from "./infra/filters/http-exception.filter"
import { LoggingInterceptor } from "./infra/interceptors/logging.interceptor"

@Module({
	imports: [
		CommonModule,
		DrizzleModule,
		AuthModule,
		BullmqModule,
		AppConfigModule,
		// [IF GraphQL] GraphqlModule,
		// [IF GraphQL] DataloaderModule,
		__Domain__Module,
	],
	controllers: [HealthcheckController],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_FILTER, useClass: HttpExceptionFilter },
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
	],
})
export class AppModule {}
