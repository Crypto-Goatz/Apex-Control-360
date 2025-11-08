import React from 'react';

export type Page = 'CRM' | 'Creative' | 'Analyzer' | 'Analytics' | 'Automation' | 'Social';

export interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SubMenu {
  title: string;
  items: SubMenuItem[];
}

export type SyncDirection = 'MCP → GHL' | 'GHL → MCP' | 'Bidirectional';
export type SyncStatus = 'OK' | 'Warning' | 'Error' | 'Syncing';

export interface SyncModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  direction: SyncDirection;
  status: SyncStatus;
  scopes: string[];
  lastSync: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  module: string;
  user: string;
  status: 'Success' | 'Failure';
  summary: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

// Types for Automation Builder
export type StepType = 'trigger' | 'action' | 'delay' | 'condition';

export interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  description: string;
  icon: React.ReactNode;
  configured: boolean;
}

// Types for Social Content Studio
export interface SocialPost {
    id: string;
    platform: 'Twitter' | 'Community' | 'LinkedIn';
    content: string;
    mediaUrl?: string;
    status: 'Draft' | 'Scheduled' | 'Posted';
    scheduledAt: Date | null;
}
