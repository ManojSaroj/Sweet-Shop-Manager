import { Module } from '@nestjs/common';
import { SweetsController } from './sweets.controller';
import { SweetsService } from './sweets.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SweetsController],
  providers: [SweetsService],
  exports: [SweetsService],
})
export class SweetsModule {}
