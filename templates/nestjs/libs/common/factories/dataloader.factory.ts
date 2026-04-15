// [GQL]
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common"
import DataLoader from "dataloader"
import { logError } from "../utils/log-error"

@Injectable()
export class DataloaderFactory {
	private readonly logger = new Logger(DataloaderFactory.name)

	create<K, V>(
		batchFn: (keys: readonly K[]) => Promise<(V | Error)[]>,
		options?: DataLoader.Options<K, V>,
	): DataLoader<K, V> {
		const wrappedFn = async (keys: readonly K[]): Promise<(V | Error)[]> => {
			try {
				return await batchFn(keys)
			} catch (error) {
				logError(error, this.logger)
				throw new InternalServerErrorException()
			}
		}

		return new DataLoader<K, V>(wrappedFn, options)
	}
}
