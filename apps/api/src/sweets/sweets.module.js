import { Module } from '@nestjs/common';
import { SweetsController } from './sweets.controller.js';
import { SweetsService } from './sweets.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SweetsController],
  providers: [SweetsService],
  exports: [SweetsService],
})
export class SweetsModule {}
