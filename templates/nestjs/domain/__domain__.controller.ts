// [REST]
import { Controller, Get, Param } from '@nestjs/common';
import { __Domain__Service } from '../services/__domain__.service';

@Controller('__domain__')
export class __Domain__Controller {
  constructor(private readonly __domain__Service: __Domain__Service) {}

  @Get()
  async findAll() {
    return this.__domain__Service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.__domain__Service.findById(id);
  }
}
