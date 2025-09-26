import { Controller, Post, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AdminGuard } from '../auth/guards/admin.guard.js';

@ApiTags('inventory')
@Controller('sweets/:id')
export class InventoryController {
  constructor(@Inject(InventoryService) inventoryService) {
    this.inventoryService = inventoryService;
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a sweet (authenticated)' })
  @ApiResponse({ status: 200, description: 'Purchase successful' })
  @ApiResponse({ status: 400, description: 'Out of stock' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sweet not found' })
  async purchase(@Param('id') id, @Body() purchaseDto) {
    return this.inventoryService.purchase(id, purchaseDto);
  }

  @Post('restock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restock a sweet (Admin only)' })
  @ApiResponse({ status: 200, description: 'Restock successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Sweet not found' })
  async restock(@Param('id') id, @Body() restockDto) {
    return this.inventoryService.restock(id, restockDto);
  }
}
