import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import {
  CreateDealDto,
  UpdateDealDto,
  DealResponseDto,
  MoveDealsDto,
  DealFiltersDto,
  DealStage,
  DealPriority
} from '../dto/deal.dto';
import { MessageResponseDto } from '../dto/auth.dto';

@ApiTags('Deals')
@ApiBearerAuth('JWT-auth')
@Controller('api/deals')
export class DealsController {
  @Get()
  @ApiOperation({
    summary: 'Get all deals',
    description: 'Retrieve all sponsorship deals with optional filtering'
  })
  @ApiQuery({
    name: 'stage',
    enum: DealStage,
    required: false,
    description: 'Filter by workflow stage'
  })
  @ApiQuery({
    name: 'priority',
    enum: DealPriority,
    required: false,
    description: 'Filter by priority level'
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search in title and brand'
  })
  @ApiQuery({
    name: 'tags',
    type: [String],
    required: false,
    description: 'Filter by tags (comma-separated)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of deals retrieved successfully',
    type: [DealResponseDto]
  })
  async getDeals(@Query() filters: DealFiltersDto): Promise<DealResponseDto[]> {
    // Implementation would filter and return deals
    return [];
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get deal by ID',
    description: 'Retrieve a specific sponsorship deal by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Deal retrieved successfully',
    type: DealResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Deal not found'
  })
  async getDeal(@Param('id') id: string): Promise<DealResponseDto> {
    // Implementation would fetch and return the deal
    return {} as DealResponseDto;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new deal',
    description: 'Create a new sponsorship deal'
  })
  @ApiResponse({
    status: 201,
    description: 'Deal created successfully',
    type: DealResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data'
  })
  async createDeal(@Body() createDealDto: CreateDealDto): Promise<DealResponseDto> {
    // Implementation would create and return the deal
    return {} as DealResponseDto;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update deal',
    description: 'Update an existing sponsorship deal'
  })
  @ApiParam({
    name: 'id',
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Deal updated successfully',
    type: DealResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Deal not found'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data'
  })
  async updateDeal(
    @Param('id') id: string,
    @Body() updateDealDto: UpdateDealDto
  ): Promise<DealResponseDto> {
    // Implementation would update and return the deal
    return {} as DealResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete deal',
    description: 'Delete a sponsorship deal'
  })
  @ApiParam({
    name: 'id',
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 204,
    description: 'Deal deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Deal not found'
  })
  async deleteDeal(@Param('id') id: string): Promise<void> {
    // Implementation would delete the deal
  }

  @Post('move')
  @ApiOperation({
    summary: 'Move deals to different stage',
    description: 'Bulk move multiple deals to a different workflow stage'
  })
  @ApiResponse({
    status: 200,
    description: 'Deals moved successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid stage or deal IDs'
  })
  async moveDeals(@Body() moveDealsDto: MoveDealsDto): Promise<MessageResponseDto> {
    // Implementation would move deals and return success message
    return {
      success: true,
      message: `${moveDealsDto.dealIds.length} deals moved to ${moveDealsDto.targetStage}`,
    };
  }

  @Get('stage/:stage')
  @ApiOperation({
    summary: 'Get deals by stage',
    description: 'Retrieve all deals in a specific workflow stage'
  })
  @ApiParam({
    name: 'stage',
    enum: DealStage,
    description: 'Workflow stage'
  })
  @ApiResponse({
    status: 200,
    description: 'Deals retrieved successfully',
    type: [DealResponseDto]
  })
  async getDealsByStage(@Param('stage') stage: DealStage): Promise<DealResponseDto[]> {
    // Implementation would return deals filtered by stage
    return [];
  }

  @Get('analytics/summary')
  @ApiOperation({
    summary: 'Get deals analytics summary',
    description: 'Get analytics summary including total value, deal counts by stage, etc.'
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalDeals: { type: 'number', example: 42 },
        totalValue: { type: 'number', example: 2500000 },
        dealsByStage: {
          type: 'object',
          properties: {
            prospecting: { type: 'number', example: 5 },
            initial_contact: { type: 'number', example: 8 },
            negotiation: { type: 'number', example: 12 },
            contract_sent: { type: 'number', example: 3 },
            contract_signed: { type: 'number', example: 2 },
            content_creation: { type: 'number', example: 4 },
            content_review: { type: 'number', example: 2 },
            published: { type: 'number', example: 3 },
            completed: { type: 'number', example: 3 },
          }
        },
        averageDealValue: { type: 'number', example: 59524 },
        overdueDeals: { type: 'number', example: 7 },
      }
    }
  })
  async getAnalyticsSummary(): Promise<any> {
    // Implementation would calculate and return analytics
    return {
      totalDeals: 42,
      totalValue: 2500000,
      dealsByStage: {
        prospecting: 5,
        initial_contact: 8,
        negotiation: 12,
        contract_sent: 3,
        contract_signed: 2,
        content_creation: 4,
        content_review: 2,
        published: 3,
        completed: 3,
      },
      averageDealValue: 59524,
      overdueDeals: 7,
    };
  }
}