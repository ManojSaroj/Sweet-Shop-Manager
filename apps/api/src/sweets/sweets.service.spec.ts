import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SweetsService', () => {
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
        SweetsService,
        {
          provide: PrismaService,
          useValue: {
            sweet: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(SweetsService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all sweets without filters', async () => {
      jest.spyOn(prismaService.sweet, 'findMany').mockResolvedValue([mockSweet]);

      const result = await service.findAll({});

      expect(prismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockSweet]);
    });

    it('should filter sweets by name', async () => {
      const query = { name: 'chocolate' };
      jest.spyOn(prismaService.sweet, 'findMany').mockResolvedValue([mockSweet]);

      await service.findAll(query);

      expect(prismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'chocolate', mode: 'insensitive' },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter sweets by category', async () => {
      const query = { category: 'Chocolate' };
      jest.spyOn(prismaService.sweet, 'findMany').mockResolvedValue([mockSweet]);

      await service.findAll(query);

      expect(prismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {
          category: 'Chocolate',
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter sweets by price range', async () => {
      const query = { minPrice: '1.00', maxPrice: '5.00' };
      jest.spyOn(prismaService.sweet, 'findMany').mockResolvedValue([mockSweet]);

      await service.findAll(query);

      expect(prismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {
          price: { gte: 1.00, lte: 5.00 },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    const createSweetDto = {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.99,
      quantity: 10,
    };

    it('should create a new sweet', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.sweet, 'create').mockResolvedValue(mockSweet);

      const result = await service.create(createSweetDto);

      expect(prismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { name: createSweetDto.name },
      });
      expect(prismaService.sweet.create).toHaveBeenCalledWith({
        data: {
          name: createSweetDto.name,
          category: createSweetDto.category,
          price: 2.99,
          quantity: 10,
        },
      });
      expect(result).toEqual(mockSweet);
    });

    it('should throw ConflictException if sweet name already exists', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(mockSweet);

      await expect(service.create(createSweetDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.sweet.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateSweetDto = {
      name: 'Updated Chocolate Bar',
      price: 3.99,
    };

    it('should update an existing sweet', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique')
        .mockResolvedValueOnce(mockSweet) // First call for finding the sweet to update
        .mockResolvedValueOnce(null); // Second call for checking name conflict (no conflict)
      jest.spyOn(prismaService.sweet, 'update').mockResolvedValue({
        ...mockSweet,
        ...updateSweetDto,
      });

      const result = await service.update('1', updateSweetDto);

      expect(prismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateSweetDto,
          price: 3.99,
        },
      });
      expect(result).toEqual({ ...mockSweet, ...updateSweetDto });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(null);

      await expect(service.update('1', updateSweetDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.sweet.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if new name conflicts with existing sweet', async () => {
      const existingSweet = { ...mockSweet, id: '2' };
      jest.spyOn(prismaService.sweet, 'findUnique')
        .mockResolvedValueOnce(mockSweet) // First call for finding the sweet to update
        .mockResolvedValueOnce(existingSweet); // Second call for checking name conflict

      await expect(service.update('1', updateSweetDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.sweet.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an existing sweet', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(mockSweet);
      jest.spyOn(prismaService.sweet, 'delete').mockResolvedValue(mockSweet);

      const result = await service.remove('1');

      expect(prismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.sweet.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockSweet);
    });

    it('should throw NotFoundException if sweet not found', async () => {
      jest.spyOn(prismaService.sweet, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(prismaService.sweet.delete).not.toHaveBeenCalled();
    });
  });
});
