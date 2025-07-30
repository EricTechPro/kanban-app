import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsArray, IsUUID, Min } from 'class-validator';

export enum DealStage {
  PROSPECTING = 'prospecting',
  INITIAL_CONTACT = 'initial_contact',
  NEGOTIATION = 'negotiation',
  CONTRACT_SENT = 'contract_sent',
  CONTRACT_SIGNED = 'contract_signed',
  CONTENT_CREATION = 'content_creation',
  CONTENT_REVIEW = 'content_review',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
}

export enum DealPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateDealDto {
  @ApiProperty({
    description: 'Deal title',
    example: 'Tech Review - Smartphone X',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Brand or company name',
    example: 'TechCorp Inc.',
  })
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Deal value in cents',
    example: 500000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiPropertyOptional({
    description: 'Deal due date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    enum: DealStage,
    description: 'Current workflow stage',
    example: DealStage.PROSPECTING,
    default: DealStage.PROSPECTING,
  })
  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage = DealStage.PROSPECTING;

  @ApiProperty({
    enum: DealPriority,
    description: 'Deal priority level',
    example: DealPriority.MEDIUM,
    default: DealPriority.MEDIUM,
  })
  @IsEnum(DealPriority)
  @IsOptional()
  priority?: DealPriority = DealPriority.MEDIUM;

  @ApiPropertyOptional({
    description: 'Deal tags',
    example: ['technology', 'smartphone', 'review'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Requires unboxing video and 30-day usage review',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDealDto extends CreateDealDto {
  @ApiProperty({
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;
}

export class DealResponseDto {
  @ApiProperty({
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Deal title',
    example: 'Tech Review - Smartphone X',
  })
  title: string;

  @ApiProperty({
    description: 'Brand or company name',
    example: 'TechCorp Inc.',
  })
  brand: string;

  @ApiProperty({
    description: 'Deal value in cents',
    example: 500000,
  })
  value: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Deal due date',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  dueDate?: string;

  @ApiProperty({
    enum: DealStage,
    description: 'Current workflow stage',
    example: DealStage.NEGOTIATION,
  })
  stage: DealStage;

  @ApiProperty({
    enum: DealPriority,
    description: 'Deal priority level',
    example: DealPriority.HIGH,
  })
  priority: DealPriority;

  @ApiProperty({
    description: 'Deal tags',
    example: ['technology', 'smartphone', 'review'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Additional notes',
    example: 'Requires unboxing video and 30-day usage review',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 45,
  })
  progress: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T12:30:00Z',
  })
  updatedAt: string;
}

export class MoveDealsDto {
  @ApiProperty({
    description: 'Array of deal IDs to move',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  dealIds: string[];

  @ApiProperty({
    enum: DealStage,
    description: 'Target stage to move deals to',
    example: DealStage.CONTRACT_SENT,
  })
  @IsEnum(DealStage)
  targetStage: DealStage;
}

export class DealFiltersDto {
  @ApiPropertyOptional({
    enum: DealStage,
    description: 'Filter by stage',
    example: DealStage.NEGOTIATION,
  })
  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @ApiPropertyOptional({
    enum: DealPriority,
    description: 'Filter by priority',
    example: DealPriority.HIGH,
  })
  @IsEnum(DealPriority)
  @IsOptional()
  priority?: DealPriority;

  @ApiPropertyOptional({
    description: 'Filter by tags',
    example: ['technology'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'smartphone',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter deals due before this date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  dueBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter deals due after this date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  dueAfter?: string;
}