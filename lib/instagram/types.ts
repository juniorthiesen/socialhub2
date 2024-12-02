export type DateFilter = '7days' | '30days' | '90days' | 'month' | 'year' | {
  start: string;
  end: string;
};

export type PostSortType = 'date' | 'likes' | 'comments' | 'engagement';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  comments_count: number;
  like_count: number;
  thumbnail_url?: string;
  displayUrl?: string;
  engagement_rate: number;
  automationRule?: AutomationRule;
}

export interface InstagramAccount {
  id: string;
  username: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
  followers_gained: number;
}

export interface InstagramInsights {
  totalLikes: number;
  totalComments: number;
  avgEngagement: number;
  likes_change: number;
  comments_change: number;
  shares: number;
  shares_change: number;
  saves: number;
  saves_change: number;
  reach: number;
  reach_change: number;
  engagement_change: number;
}

export interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count: number;
  hidden?: boolean;
  replies?: {
    data: Comment[];
  };
}

export interface AutomationRule {
  id: string;
  postId?: string;
  trigger: string;
  response: string;
  dmMessage?: string;
  dmTemplate?: {
    template_type: 'button';
    text: string;
    buttons: MessageButton[];
  };
  actionUrl?: string;
  isActive: boolean;
  sendDm: boolean;
  autoReply: boolean;
}

export interface MessageButton {
  type: 'web_url';
  title: string;
  url: string;
}

export interface DMTemplate {
  template_type: 'button';
  text: string;
  buttons: MessageButton[];
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  tasks: string[];
  instagram_business_account?: {
    id: string;
  };
}