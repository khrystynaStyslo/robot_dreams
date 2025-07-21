import { Controller, Get, Post, Put, Delete, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TeaService } from './tea.service';
import { ZBody } from '../common/decorators/zbody.decorator';
import { TeaSchema, UpdateTeaSchema, CreateTeaDto, UpdateTeaDto } from './dto/tea.dto';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('tea')
@Controller('tea')
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all teas' })
  @ApiQuery({ name: 'minRating', required: false, type: Number, description: 'Minimum rating filter (1-10)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Paginated tea list' })
  async findAll(
    @Query('minRating') minRating?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.teaService.findAll({ minRating, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tea by ID' })
  @ApiParam({ name: 'id', description: 'Tea ID' })
  @ApiResponse({ status: 200, description: 'Tea found' })
  @ApiResponse({ status: 404, description: 'Tea not found' })
  async findOne(@Param('id') id: string) {
    const tea = await this.teaService.findOne(id);

    if (!tea) {
      throw new NotFoundException('Tea not found');
    }

    return tea;
  }

  @Post()
  @ApiOperation({ summary: 'Create new tea' })
  @ApiBody({ type: CreateTeaDto })
  @ApiResponse({ status: 201, description: 'Tea created' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @UseGuards(RateLimitGuard)
  @RateLimit({ ttl: 60, limit: 10 })
  async create(@ZBody(TeaSchema) createTeaDto: CreateTeaDto) {
    return this.teaService.create(createTeaDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tea' })
  @ApiParam({ name: 'id', description: 'Tea ID' })
  @ApiBody({ type: UpdateTeaDto })
  @ApiResponse({ status: 200, description: 'Tea updated' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async update(
    @Param('id') id: string,
    @ZBody(UpdateTeaSchema) updateTeaDto: UpdateTeaDto,
  ) {
    return this.teaService.update(id, updateTeaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tea' })
  @ApiParam({ name: 'id', description: 'Tea ID' })
  @ApiResponse({ status: 200, description: 'Tea deleted' })
  async remove(@Param('id') id: string) {
    return this.teaService.remove(id);
  }
}
