import { Module } from '@nestjs/common';
import { __Domain__Service } from './services/__domain__.service';
// [IF GraphQL] import { __Domain__Resolver } from './resolvers/__domain__.resolver';
// [IF REST] import { __Domain__Controller } from './controllers/__domain__.controller';

@Module({
  // [IF REST] controllers: [__Domain__Controller],
  providers: [
    __Domain__Service,
    // [IF GraphQL] __Domain__Resolver,
  ],
  exports: [__Domain__Service],
})
export class __Domain__Module {}
