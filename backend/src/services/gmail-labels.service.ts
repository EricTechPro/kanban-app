import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';

export interface GmailLabel {
  id: string;
  name: string;
  type?: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
}

export interface KanbanLabels {
  parentLabel: GmailLabel;
  stageLabels: Map<string, GmailLabel>;
}

@Injectable()
export class GmailLabelsService {
  private readonly logger = new Logger(GmailLabelsService.name);
  private readonly kanbanStages = [
    'prospecting',
    'initial-contact',
    'negotiation',
    'contract-sent',
    'contract-signed',
    'content-creation',
    'content-review',
    'published',
    'completed'
  ];

  constructor(private prisma: PrismaService) { }

  /**
   * Get Gmail client for a user
   */
  private async getGmailClient(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        encryptedAccessToken: true,
        encryptedRefreshToken: true,
        tokenEncryptionKey: true,
      },
    });

    if (!user?.encryptedAccessToken) {
      throw new Error('Gmail not connected');
    }

    // In a real implementation, you would decrypt the tokens here
    // For now, we'll use them as-is (assuming they're not actually encrypted in dev)
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: user.encryptedAccessToken,
      refresh_token: user.encryptedRefreshToken,
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  /**
   * Get all Gmail labels for a user
   */
  async getAllLabels(userId: string): Promise<GmailLabel[]> {
    const gmail = await this.getGmailClient(userId);
    const response = await gmail.users.labels.list({ userId: 'me' });
    return (response.data.labels || []).map(label => ({
      id: label.id || '',
      name: label.name || '',
      type: label.type,
      messageListVisibility: label.messageListVisibility,
      labelListVisibility: label.labelListVisibility,
    }));
  }

  /**
   * Create a Gmail label
   */
  async createLabel(userId: string, labelName: string): Promise<GmailLabel> {
    const gmail = await this.getGmailClient(userId);
    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });
    return {
      id: response.data.id || '',
      name: response.data.name || '',
      type: response.data.type,
      messageListVisibility: response.data.messageListVisibility,
      labelListVisibility: response.data.labelListVisibility,
    };
  }

  /**
   * Get or create the kanban parent label and all stage sub-labels
   */
  async ensureKanbanLabels(userId: string): Promise<KanbanLabels> {
    const allLabels = await this.getAllLabels(userId);
    const labelMap = new Map(allLabels.map(label => [label.name, label]));

    // Check for parent kanban label
    let parentLabel = labelMap.get('kanban');
    if (!parentLabel) {
      this.logger.log('Creating parent kanban label');
      parentLabel = await this.createLabel(userId, 'kanban');
    }

    // Check and create stage labels
    const stageLabels = new Map<string, GmailLabel>();

    for (const stage of this.kanbanStages) {
      const labelName = `kanban/${stage}`;
      let stageLabel = labelMap.get(labelName);

      if (!stageLabel) {
        this.logger.log(`Creating stage label: ${labelName}`);
        stageLabel = await this.createLabel(userId, labelName);
      }

      stageLabels.set(stage, stageLabel);
    }

    return {
      parentLabel,
      stageLabels,
    };
  }

  /**
   * Get emails for a specific kanban stage
   */
  async getEmailsByStage(userId: string, stage: string) {
    const gmail = await this.getGmailClient(userId);
    const { stageLabels } = await this.ensureKanbanLabels(userId);
    const stageLabel = stageLabels.get(stage);

    if (!stageLabel) {
      throw new Error(`Stage label not found: ${stage}`);
    }

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [stageLabel.id],
      maxResults: 100,
    });

    const messages = response.data.messages || [];
    const emails = [];

    for (const message of messages) {
      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
      });
      emails.push(this.parseEmailToDeal(fullMessage.data));
    }

    return emails;
  }

  /**
   * Move an email to a different kanban stage
   */
  async moveEmailToStage(userId: string, messageId: string, fromStage: string, toStage: string) {
    const gmail = await this.getGmailClient(userId);
    const { stageLabels } = await this.ensureKanbanLabels(userId);

    const fromLabel = stageLabels.get(fromStage);
    const toLabel = stageLabels.get(toStage);

    if (!fromLabel || !toLabel) {
      throw new Error('Invalid stage labels');
    }

    // Remove old label and add new label
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: [fromLabel.id],
        addLabelIds: [toLabel.id],
      },
    });
  }

  /**
   * Parse Gmail message to Deal format
   */
  private parseEmailToDeal(message: any) {
    const headers = message.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    const subject = getHeader('subject');
    const from = getHeader('from');
    const date = getHeader('date');

    // Extract sender name and email
    const fromMatch = from.match(/^(.*?)\s*<(.+?)>$/);
    const senderName = fromMatch ? fromMatch[1].trim() : from.split('@')[0];
    const senderEmail = fromMatch ? fromMatch[2] : from;

    // Try to extract value from subject (look for common patterns like $X,XXX or XXXk)
    const valueMatch = subject.match(/\$?([\d,]+)k?|\$?([\d,]+)/i);
    const value = valueMatch
      ? parseFloat(valueMatch[1]?.replace(/,/g, '') || valueMatch[2]?.replace(/,/g, '') || '0') *
      (subject.toLowerCase().includes('k') ? 1000 : 1)
      : 0;

    return {
      id: message.id,
      title: subject,
      brand: senderName,
      value: value,
      currency: 'USD',
      dueDate: new Date(date),
      priority: 'medium' as const,
      stage: 'prospecting' as const, // Will be overridden by actual label
      progress: 0,
      tags: ['email'],
      dealType: 'sponsored-video' as const,
      deliverables: [],
      primaryContact: {
        name: senderName,
        email: senderEmail,
      },
      notes: `Imported from Gmail: ${message.id}`,
      createdAt: new Date(date),
      updatedAt: new Date(),
      isFromGmail: true,
      gmailMessageId: message.id,
      gmailThreadId: message.threadId,
    };
  }

  /**
   * Sync all kanban emails to deals
   */
  async syncKanbanEmails(userId: string) {
    const { stageLabels } = await this.ensureKanbanLabels(userId);
    const allDeals = [];

    for (const [stage, label] of stageLabels) {
      const emails = await this.getEmailsByStage(userId, stage);
      const dealsWithStage = emails.map(email => ({
        ...email,
        stage: stage as any,
      }));
      allDeals.push(...dealsWithStage);
    }

    return allDeals;
  }
}