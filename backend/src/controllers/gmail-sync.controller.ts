import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GmailLabelsService } from '../services/gmail-labels.service';

export class SyncKanbanEmailsDto {
  // No body needed, uses authenticated user
}

export class MoveEmailDto {
  messageId: string;
  fromStage: string;
  toStage: string;
}

export class GmailDealDto {
  id: string;
  title: string;
  brand: string;
  value: number;
  currency: string;
  dueDate: Date;
  priority: string;
  stage: string;
  progress: number;
  tags: string[];
  dealType: string;
  deliverables: string[];
  primaryContact: {
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isFromGmail: boolean;
  gmailMessageId: string;
  gmailThreadId: string;
}

@ApiTags('Gmail Sync')
@ApiBearerAuth('JWT-auth')
@Controller('api/gmail')
export class GmailSyncController {
  constructor(private gmailLabelsService: GmailLabelsService) { }

  @Post('sync/labels')
  @ApiOperation({
    summary: 'Ensure kanban labels exist in Gmail',
    description: 'Creates the kanban parent label and all stage sub-labels if they don\'t exist',
  })
  @ApiResponse({
    status: 200,
    description: 'Labels created/verified successfully',
  })
  @HttpCode(HttpStatus.OK)
  async ensureKanbanLabels(@Request() req: any) {
    return await this.gmailLabelsService.ensureKanbanLabels(req.user.id);
  }

  @Get('sync/emails')
  @ApiOperation({
    summary: 'Sync Gmail emails with kanban stages',
    description: 'Fetches all emails labeled with kanban stages and converts them to deals',
  })
  @ApiResponse({
    status: 200,
    description: 'Emails synced successfully',
    type: [GmailDealDto],
  })
  async syncKanbanEmails(@Request() req: any): Promise<GmailDealDto[]> {
    return await this.gmailLabelsService.syncKanbanEmails(req.user.id);
  }

  @Get('sync/stage/:stage')
  @ApiOperation({
    summary: 'Get emails for a specific kanban stage',
    description: 'Fetches emails labeled with a specific kanban stage',
  })
  @ApiParam({
    name: 'stage',
    description: 'Kanban stage name',
    example: 'prospecting',
  })
  @ApiResponse({
    status: 200,
    description: 'Emails retrieved successfully',
    type: [GmailDealDto],
  })
  async getEmailsByStage(
    @Request() req: any,
    @Param('stage') stage: string
  ): Promise<GmailDealDto[]> {
    return await this.gmailLabelsService.getEmailsByStage(req.user.id, stage);
  }

  @Post('sync/move')
  @ApiOperation({
    summary: 'Move email to different kanban stage',
    description: 'Updates Gmail labels to move an email from one kanban stage to another',
  })
  @ApiResponse({
    status: 200,
    description: 'Email moved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async moveEmailToStage(
    @Request() req: any,
    @Body() moveEmailDto: MoveEmailDto
  ) {
    const { messageId, fromStage, toStage } = moveEmailDto;
    await this.gmailLabelsService.moveEmailToStage(
      req.user.id,
      messageId,
      fromStage,
      toStage
    );
    return { success: true, message: 'Email moved successfully' };
  }

  @Get('labels')
  @ApiOperation({
    summary: 'Get all Gmail labels',
    description: 'Fetches all Gmail labels for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Labels retrieved successfully',
  })
  async getAllLabels(@Request() req: any) {
    return await this.gmailLabelsService.getAllLabels(req.user.id);
  }
}