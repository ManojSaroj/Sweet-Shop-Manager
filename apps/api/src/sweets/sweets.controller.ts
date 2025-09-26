import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SweetsService } from './sweets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('sweets')
@Controller('sweets')
export class SweetsController {
  private sweetsService: SweetsService;

  constructor(sweetsService: SweetsService) {
    this.sweetsService = sweetsService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all sweets' })
  @ApiResponse({ status: 200, description: 'List of sweets' })
  async findAll(@Query() query: any) {
    return this.sweetsService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search sweets with filters' })
  @ApiResponse({ status: 200, description: 'Filtered sweets' })
  async search(@Query() query: any) {
    return this.sweetsService.findAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new sweet (authenticated)' })
  @ApiResponse({ status: 201, description: 'Sweet created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createSweetDto: any) {
    return this.sweetsService.create(createSweetDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a sweet (authenticated)' })
  @ApiResponse({ status: 200, description: 'Sweet updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sweet not found' })
  async update(@Param('id') id: string, @Body() updateSweetDto: any) {
    return this.sweetsService.update(id, updateSweetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a sweet (admin only)' })
  @ApiResponse({ status: 200, description: 'Sweet deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Sweet not found' })
  async remove(@Param('id') id: string) {
    return this.sweetsService.remove(id);
  }
}
