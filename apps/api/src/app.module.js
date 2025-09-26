import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SweetsModule } from './sweets/sweets.module.js';
import { InventoryModule } from './inventory/inventory.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SweetsModule,
    InventoryModule,
  ],
})
export class AppModule {}
