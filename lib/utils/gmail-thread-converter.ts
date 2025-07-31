import { Deal, GmailThread, GmailMessage, Priority, DealType } from '@/lib/types';
import { GMAIL_CONFIG } from '@/lib/constants';

export class GmailThreadConverter {
  /**
   * Convert a Gmail thread to a Deal object
   */
  static threadToDeal(thread: GmailThread): Deal {
    const firstMessage = thread.messages[0];
    const lastMessage = thread.messages[thread.messages.length - 1];

    return {
      id: thread.threadId,
      title: firstMessage.subject,
      brand: this.extractBrandName(firstMessage.from),
      value: this.extractValue(thread.messages),
      currency: 'USD',
      dueDate: this.calculateDueDate(),
      priority: this.calculatePriority(thread),
      stage: thread.stage,
      progress: 0,
      tags: this.extractTags(thread.messages),
      dealType: this.detectDealType(thread.messages),
      deliverables: [],
      primaryContact: {
        name: this.extractBrandName(firstMessage.from),
        email: this.extractEmail(firstMessage.from),
      },
      notes: `Thread contains ${thread.messages.length} email${thread.messages.length > 1 ? 's' : ''}`,
      createdAt: new Date(firstMessage.date),
      updatedAt: new Date(lastMessage.date),
      isFromGmail: true,
      gmailThreadId: thread.threadId,
      gmailMessageId: firstMessage.id,
      gmailMessages: thread.messages,
      emailCount: thread.messages.length,
      lastEmailDate: new Date(lastMessage.date),
    };
  }

  /**
   * Extract brand name from email address
   */
  private static extractBrandName(fromEmail: string): string {
    const brandMatch = fromEmail.match(/^(.+?)\s*</) || fromEmail.match(/^(.+?)@/);
    return brandMatch ? brandMatch[1].trim() : fromEmail.split('@')[0];
  }

  /**
   * Extract email address from "Name <email>" format
   */
  private static extractEmail(fromEmail: string): string {
    const emailMatch = fromEmail.match(/<(.+?)>/);
    return emailMatch ? emailMatch[1] : fromEmail;
  }

  /**
   * Extract monetary value from messages
   */
  private static extractValue(messages: GmailMessage[]): number {
    for (const message of messages) {
      // Check subject first
      const subjectMatch = message.subject.match(/\$?([\d,]+(?:\.\d{2})?)/);
      if (subjectMatch) {
        return parseFloat(subjectMatch[1].replace(/,/g, ''));
      }

      // Check body if available
      if (message.body) {
        const bodyMatch = message.body.match(/\$?([\d,]+(?:\.\d{2})?)/);
        if (bodyMatch) {
          return parseFloat(bodyMatch[1].replace(/,/g, ''));
        }
      }
    }

    return 0;
  }

  /**
   * Calculate due date based on configuration
   */
  private static calculateDueDate(): Date {
    const daysToAdd = GMAIL_CONFIG.SYNC.DEFAULT_DUE_DATE_DAYS;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    return dueDate;
  }

  /**
   * Calculate priority based on thread activity
   */
  private static calculatePriority(thread: GmailThread): Priority {
    const lastMessage = thread.messages[thread.messages.length - 1];
    const daysSinceLastEmail = (new Date().getTime() - new Date(lastMessage.date).getTime()) / (1000 * 60 * 60 * 24);

    if (
      thread.messages.length >= GMAIL_CONFIG.SYNC.MIN_EMAILS_FOR_HIGH_PRIORITY ||
      daysSinceLastEmail < GMAIL_CONFIG.SYNC.DEFAULT_PRIORITY_DAYS.HIGH
    ) {
      return 'high';
    }

    if (
      thread.messages.length >= GMAIL_CONFIG.SYNC.MIN_EMAILS_FOR_MEDIUM_PRIORITY ||
      daysSinceLastEmail < GMAIL_CONFIG.SYNC.DEFAULT_PRIORITY_DAYS.MEDIUM
    ) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Extract tags from email content
   */
  private static extractTags(messages: GmailMessage[]): string[] {
    const tags = new Set<string>();

    messages.forEach(message => {
      const content = `${message.subject} ${message.snippet}`.toLowerCase();

      Object.entries(GMAIL_CONFIG.TAGS.KEYWORDS).forEach(([tag, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
          tags.add(tag);
        }
      });
    });

    return Array.from(tags);
  }

  /**
   * Detect deal type from email content
   */
  private static detectDealType(messages: GmailMessage[]): DealType {
    const content = messages
      .map(m => `${m.subject} ${m.snippet}`)
      .join(' ')
      .toLowerCase();

    if (content.includes('sponsor') || content.includes('sponsored video')) {
      return 'sponsored-video';
    }

    if (content.includes('review') || content.includes('product review')) {
      return 'product-review';
    }

    if (content.includes('integration') || content.includes('brand integration')) {
      return 'brand-integration';
    }

    return 'other';
  }
}