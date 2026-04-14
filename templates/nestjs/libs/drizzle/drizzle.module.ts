import { Global, Module } from "@nestjs/common"
import { DrizzleService } from "./services/drizzle.service"

@Global()
@Module({
	providers: [DrizzleService],
	exports: [DrizzleService],
})
export class DrizzleModule {}
