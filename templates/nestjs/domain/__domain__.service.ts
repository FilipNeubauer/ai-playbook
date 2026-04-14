import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class __Domain__Service {
  private readonly logger = new Logger(__Domain__Service.name);

  async findAll(): Promise<void> {
    this.logger.log('Finding all __domain__ records');
    // TODO: implement
  }

  async findById(id: string): Promise<void> {
    this.logger.log(`Finding __domain__ by id=${id}`);
    // TODO: implement
  }
}
