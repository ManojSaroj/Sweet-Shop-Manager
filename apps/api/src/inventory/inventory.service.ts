import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  private prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async purchase(sweetId: string, purchaseDto: any) {
    const { quantity = 1 } = purchaseDto;

    const sweet = await this.prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      throw new NotFoundException('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new BadRequestException({
        code: 'OUT_OF_STOCK',
        message: 'Insufficient quantity available',
        details: { available: sweet.quantity, requested: quantity },
      });
    }

    return this.prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: sweet.quantity - quantity,
      },
    });
  }

  async restock(sweetId: string, restockDto: any) {
    const { quantity } = restockDto;

    const sweet = await this.prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      throw new NotFoundException('Sweet not found');
    }

    return this.prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: sweet.quantity + quantity,
      },
    });
  }
}
