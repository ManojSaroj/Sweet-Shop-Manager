import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SweetsService {
  private prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findAll(query: any) {
    const { name, category, minPrice, maxPrice } = query;
    
    const where: any = {};
    
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    
    if (category) {
      where.category = category;
    }
    
    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }
    
    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    return this.prisma.sweet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createSweetDto: any) {
    const { name, category, price, quantity } = createSweetDto;

    // Check if sweet with same name already exists
    const existingSweet = await this.prisma.sweet.findUnique({
      where: { name },
    });

    if (existingSweet) {
      throw new ConflictException('Sweet with this name already exists');
    }

    return this.prisma.sweet.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    });
  }

  async update(id: string, updateSweetDto: any) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new NotFoundException('Sweet not found');
    }

    // Check if name is being updated and if it conflicts
    if (updateSweetDto.name && updateSweetDto.name !== sweet.name) {
      const existingSweet = await this.prisma.sweet.findUnique({
        where: { name: updateSweetDto.name },
      });

      if (existingSweet) {
        throw new ConflictException('Sweet with this name already exists');
      }
    }

    return this.prisma.sweet.update({
      where: { id },
      data: {
        ...updateSweetDto,
        price: updateSweetDto.price ? parseFloat(updateSweetDto.price) : undefined,
        quantity: updateSweetDto.quantity ? parseInt(updateSweetDto.quantity) : undefined,
      },
    });
  }

  async remove(id: string) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new NotFoundException('Sweet not found');
    }

    return this.prisma.sweet.delete({
      where: { id },
    });
  }
}
