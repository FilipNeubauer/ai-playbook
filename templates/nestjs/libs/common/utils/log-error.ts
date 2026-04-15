import type { Logger } from "@nestjs/common"

export function logError(error: unknown, logger: Logger): void {
	if (error instanceof Error) {
		logger.error(error.message, error.stack)
	} else {
		logger.error(error)
	}
}
