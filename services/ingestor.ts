import { FeedItem, FeedSource, TrafficLightStatus, TRAFFIC_LIGHT_KEYWORDS } from '../types';
import { MOCK_RAW_RSS_ITEMS } from './mockData';

// This file mirrors the logic requested for 'ingestor.py'

// 1. Tagging Logic (Traffic Light System)
const calculateTrafficLight = (title: string, summary: string): { status: TrafficLightStatus, keywords: string[] } => {
  const content = `${title} ${summary}`.toLowerCase();
  
  // Check Critical (Red)
  const criticalMatches = TRAFFIC_LIGHT_KEYWORDS.Critical.filter(kw => content.includes(kw));
  if (criticalMatches.length > 0) {
    return { status: 'Critical', keywords: criticalMatches };
  }

  // Check Opportunity (Yellow)
  const opportunityMatches = TRAFFIC_LIGHT_KEYWORDS.Opportunity.filter(kw => content.includes(kw));
  if (opportunityMatches.length > 0) {
    return { status: 'Opportunity', keywords: opportunityMatches };
  }

  // Default (Green)
  return { status: 'FYI', keywords: [] };
};

// 2. Feed Discovery Simulation (feedsearch-crawler)
export const findFeedUrl = async (websiteUrl: string): Promise<string | null> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!websiteUrl.includes('.')) return null;
  
  // Mock logic: assume if they typed a valid looking domain, we "found" the feed
  return `${websiteUrl.replace(/\/$/, '')}/rss.xml`;
};

// 3. Ingestion & Deduplication
// In a real app, this would check against the SQLite DB. 
// Here we process the mock data on the fly.
export const fetchAndProcessFeeds = async (activeSources: FeedSource[] = []): Promise<FeedItem[]> => {
  // Simulating API latency
  await new Promise(resolve => setTimeout(resolve, 600));

  // Process static mock items
  const staticItems = MOCK_RAW_RSS_ITEMS.map((item, index) => {
    const { status, keywords } = calculateTrafficLight(item.title, item.summary);
    return {
      id: `item-${index}`,
      title: item.title,
      summary: item.summary,
      link: item.link,
      publishedDate: item.date,
      sourceId: item.sourceId,
      status: status,
      keywordsFound: keywords
    };
  });

  // Identify sources that don't have static mock data (User added sources)
  const staticSourceIds = new Set(MOCK_RAW_RSS_ITEMS.map(i => i.sourceId));
  const customItems: FeedItem[] = [];

  activeSources.forEach(source => {
    if (!staticSourceIds.has(source.id)) {
      // Generate a mock item for this new source so the user sees it works
      const { status, keywords } = calculateTrafficLight(`Latest update from ${source.name}`, "This is a simulated new entry.");
      
      customItems.push({
        id: `custom-item-${source.id}-${Date.now()}`,
        title: `Latest Regulatory Update from ${source.name}`,
        summary: `This is a simulated feed item for the newly added source: ${source.url}. In the production Python backend, this would be real content parsed from the XML feed.`,
        link: source.url,
        publishedDate: new Date().toISOString(),
        sourceId: source.id,
        status: 'FYI',
        keywordsFound: []
      });
    }
  });

  return [...staticItems, ...customItems];
};