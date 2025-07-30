import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray, IsOptional, IsDateString, IsEmail } from 'class-validator';

export class EmailMessageDto {
  @ApiProperty({
    description: 'Email message ID',
    example: '18d5a3b2c4e5f6g7',
  })
  id: string;

  @ApiProperty({
    description: 'Thread ID',
    example: '18d5a3b2c4e5f6g7',
  })
  threadId: string;

  @ApiProperty({
    description: 'Sender email address',
    example: 'sponsor@company.com',
  })
  from: string;

  @ApiProperty({
    description: 'Recipient email addresses',
    example: ['creator@youtube.com'],
    type: [String],
  })
  to: string[];

  @ApiProperty({
    description: 'Email subject',
    example: 'Re: Sponsorship Opportunity - Tech Review',
  })
  subject: string;

  @ApiProperty({
    description: 'Email body snippet',
    example: 'Hi, I wanted to follow up on our sponsorship discussion...',
  })
  snippet: string;

  @ApiProperty({
    description: 'Full email body',
    example: 'Hi,\n\nI wanted to follow up on our sponsorship discussion...',
    required: false,
  })
  body?: string;

  @ApiProperty({
    description: 'Email labels',
    example: ['INBOX', 'IMPORTANT'],
    type: [String],
  })
  labels: string[];

  @ApiProperty({
    description: 'Whether email is read',
    example: false,
  })
  isRead: boolean;

  @ApiProperty({
    description: 'Whether email has attachments',
    example: true,
  })
  hasAttachments: boolean;

  @ApiProperty({
    description: 'Email timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class SendEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'sponsor@company.com',
  })
  @IsEmail()
  to: string;

  @ApiPropertyOptional({
    description: 'CC recipients',
    example: ['manager@company.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  cc?: string[];

  @ApiPropertyOptional({
    description: 'BCC recipients',
    example: ['assistant@youtube.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  bcc?: string[];

  @ApiProperty({
    description: 'Email subject',
    example: 'Sponsorship Proposal - Tech Channel',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Email body (HTML supported)',
    example: '<p>Dear Sponsor,</p><p>I would like to propose...</p>',
  })
  @IsString()
  body: string;

  @ApiPropertyOptional({
    description: 'Reply to message ID',
    example: '18d5a3b2c4e5f6g7',
  })
  @IsString()
  @IsOptional()
  replyTo?: string;

  @ApiPropertyOptional({
    description: 'Associated deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  dealId?: string;
}

export class EmailThreadDto {
  @ApiProperty({
    description: 'Thread ID',
    example: '18d5a3b2c4e5f6g7',
  })
  id: string;

  @ApiProperty({
    description: 'Thread subject',
    example: 'Sponsorship Opportunity - Tech Review',
  })
  subject: string;

  @ApiProperty({
    description: 'Thread participants',
    example: ['sponsor@company.com', 'creator@youtube.com'],
    type: [String],
  })
  participants: string[];

  @ApiProperty({
    description: 'Number of messages in thread',
    example: 5,
  })
  messageCount: number;

  @ApiProperty({
    description: 'Last message timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  lastMessageAt: string;

  @ApiProperty({
    description: 'Whether thread has unread messages',
    example: true,
  })
  hasUnread: boolean;

  @ApiProperty({
    description: 'Thread labels',
    example: ['INBOX', 'Sponsorship'],
    type: [String],
  })
  labels: string[];

  @ApiPropertyOptional({
    description: 'Associated deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  dealId?: string;
}

export class EmailFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by label',
    example: 'INBOX',
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({
    description: 'Filter by unread status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'sponsorship',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by sender',
    example: 'sponsor@company.com',
  })
  @IsEmail()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter emails after this date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  after?: string;

  @ApiPropertyOptional({
    description: 'Filter emails before this date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  before?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results',
    example: 50,
  })
  @IsOptional()
  maxResults?: number;
}

export class EmailTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Initial Sponsorship Outreach',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Template subject',
    example: 'Partnership Opportunity - [Channel Name]',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Template body with placeholders',
    example: 'Dear {{brandName}},\n\nI run a tech channel with {{subscriberCount}} subscribers...',
  })
  @IsString()
  body: string;

  @ApiPropertyOptional({
    description: 'Template category',
    example: 'outreach',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Template variables',
    example: { brandName: 'string', subscriberCount: 'number' },
    type: 'object',
  })
  @IsOptional()
  variables?: Record<string, string>;
}