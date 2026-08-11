import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbProvider } from '../db/db.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DbProvider],
  exports: [UsersService],
})
export class UsersModule {}
