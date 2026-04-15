import { NestFactory } from "@nestjs/core"
import { Logger } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AppModule } from "./app/app.module"
// [IF GraphQL] import { GlobalZodValidationPipe } from "./libs/common/pipes/global-zod-validation.pipe"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger("Bootstrap")

	app.enableCors()

	// [IF GraphQL] app.useGlobalPipes(new GlobalZodValidationPipe(app.get(Reflector)))

	const port = process.env.PORT || 3000
	await app.listen(port)
	logger.log(`Application running on port ${port}`)
}
bootstrap()
