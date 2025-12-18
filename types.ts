import React from 'react';

export type TrafficLightStatus = 'Critical' | 'Opportunity' | 'FYI';

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: string; // e.g., 'Medicine', 'Environment', 'AI/Tech'
  icon?: React.ReactNode;
}

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  publishedDate: string;
  sourceId: string;
  status: TrafficLightStatus;
  keywordsFound: string[];
}

export interface UserPreferences {
  followedTopics: string[];
}

export const TRAFFIC_LIGHT_KEYWORDS = {
  Critical: ['recall', 'warning', 'ban', 'alert', 'emergency', 'safety notice'],
  Opportunity: ['draft guidance', 'comment', 'consultation', 'proposal', 'rfi', 'request for information'],
  // FYI is the default catch-all
};