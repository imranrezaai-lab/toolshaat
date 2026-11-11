export type ToolType = 
  | 'image' 
  | 'pdf' 
  | 'text' 
  | 'developer' 
  | 'calculator' 
  | 'converter' 
  | 'generator' 
  | 'productivity' 
  | 'seo';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  toolType: ToolType;
  featured: boolean;
  published: boolean;
  executionCount: number;
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  howToUse: string[];
  faqs: ToolFaq[];
  tags: string[];
}

export type AdPosition = 
  | 'home-top' 
  | 'home-middle' 
  | 'home-bottom' 
  | 'directory-top' 
  | 'directory-middle' 
  | 'tool-top' 
  | 'tool-bottom' 
  | 'tool-between' 
  | 'category-top' 
  | 'category-bottom';

export interface AdSlotConfig {
  id: string;
  position: AdPosition;
  name: string;
  enabled: boolean;
  slotId: string;
  format: 'responsive' | 'banner' | 'rectangle' | 'leaderboard';
  customHtml?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  adsEnabled: boolean;
  adsenseClientId: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
    linkedin?: string;
  };
  privacyPolicy: string;
  termsOfService: string;
  analyticsEnabled: boolean;
  previewAdsMode: boolean; // displays developer wireframe placeholders for ad slots
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastActive: string;
  status: 'active' | 'suspended';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details?: string;
}

export interface ToolExecutionEvent {
  toolId: string;
  timestamp: string;
  device: 'desktop' | 'mobile' | 'tablet';
}
