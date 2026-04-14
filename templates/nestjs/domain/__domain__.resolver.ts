// [GQL]
import { Resolver, Query } from '@nestjs/graphql';
import { __Domain__Service } from '../services/__domain__.service';

@Resolver()
export class __Domain__Resolver {
  constructor(private readonly __domain__Service: __Domain__Service) {}

  @Query(() => String)
  async __domain__Hello(): Promise<string> {
    return 'Hello from __domain__';
  }
}
