import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryService', () => {
  let service;
  let prismaService;

  const mockSweet = {
    id: '1',
    name: 'Chocolate Bar',
    category: 'Chocolate',
    price: 2.99,
    quantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: {
            sweet: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(InventoryService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchase', () => {
    const purchaseDto = { quantity: 2 };

    it('should purchase sweet successfully', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(mockSweet);
      jest.spyOn(prismaService.sweet, 'update').mockResolvedValue({
        ...mockSweet,
        quantity: 8,
      });

      const result = await service.purchase('1', purchaseDto);

      expect(prismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          quantity: 8,
        },
      });
      expect(result).toEqual({
        ...mockSweet,
        quantity: 8,
      });
    });

    it('should purchase with default quantity of 1', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(mockSweet);
      jest.spyOn(prismaService.sweet, 'update').mockResolvedValue({
        ...mockSweet,
        quantity: 9,
      });

      await service.purchase('1', {});

      expect(prismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          quantity: 9,
        },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(null);

      await expect(service.purchase('1', purchaseDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.sweet.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if insufficient quantity', async () => {
      const lowStockSweet = { ...mockSweet, quantity: 1 };
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(lowStockSweet);

      await expect(service.purchase('1', purchaseDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.sweet.update).not.toHaveBeenCalled();
    });
  });

  describe('restock', () => {
    const restockDto = { quantity: 5 };

    it('should restock sweet successfully', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(mockSweet);
      jest.spyOn(prismaService.sweet, 'update').mockResolvedValue({
        ...mockSweet,
        quantity: 15,
      });

      const result = await service.restock('1', restockDto);

      expect(prismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          quantity: 15,
        },
      });
      expect(result).toEqual({
        ...mockSweet,
        quantity: 15,
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(null);

      await expect(service.restock('1', restockDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.sweet.update).not.toHaveBeenCalled();
    });
  });
});
