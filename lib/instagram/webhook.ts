import { AutomationRule } from './types';
import { InstagramAPI } from './api';

export interface WebhookPayload {
  object: 'instagram';
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: string;
      value: {
        id: string;
        media_id?: string;
        text?: string;
        from: {
          id: string;
          username: string;
        };
      };
    }>;
  }>;
}

export class WebhookHandler {
  private api: InstagramAPI;
  private automationRules: AutomationRule[];

  constructor(api: InstagramAPI, automationRules: AutomationRule[]) {
    this.api = api;
    this.automationRules = automationRules;
  }

  async handleWebhook(payload: WebhookPayload) {
    try {
      if (payload.object !== 'instagram') {
        throw new Error('Received webhook was not from Instagram');
      }

      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            await this.handleComment(change.value);
          }
        }
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  private async handleComment(comment: {
    id: string;
    media_id?: string;
    text?: string;
    from: { id: string; username: string };
  }) {
    try {
      if (!comment.media_id || !comment.text) return;

      // Find matching automation rules
      const postRule = this.automationRules.find(
        rule => rule.postId === comment.media_id && rule.isActive
      );

      const globalRules = this.automationRules.filter(
        rule => !rule.postId && rule.isActive
      );

      const matchingRules = [postRule, ...globalRules].filter(rule => {
        if (!rule) return false;
        const triggerWords = rule.trigger.toLowerCase().split(',').map(t => t.trim());
        const commentText = comment.text?.toLowerCase() || '';
        return triggerWords.some(trigger => commentText.includes(trigger));
      });

      if (matchingRules.length === 0) return;

      // Execute the most specific rule (post-specific takes precedence over global)
      const ruleToExecute = matchingRules[0];

      // Execute automation actions
      if (ruleToExecute.autoReply) {
        await this.api.replyToComment(comment.id, ruleToExecute.response);
      }

      if (ruleToExecute.sendDm) {
        await this.api.sendDirectMessage(
          comment.from.username,
          ruleToExecute.dmMessage || '',
          ruleToExecute.dmTemplate
        );
      }

      console.log(`Automation executed for comment ${comment.id} on post ${comment.media_id}`);
    } catch (error) {
      console.error('Error handling comment:', error);
      throw error;
    }
  }
}