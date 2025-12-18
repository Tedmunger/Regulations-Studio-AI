
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import FeedCard from './components/FeedCard';
import ResearchAssistant from './components/ResearchAssistant';
import { FeedItem, FeedSource } from './types';
import { fetchAndProcessFeeds } from './services/ingestor';
import { RefreshCw, Search, ShieldAlert, Zap, Info, ArrowLeft, Layers, Loader2, AlertCircle } from 'lucide-react';

const DEFAULT_SOURCES: FeedSource[] = [
  { id: 'fda-drug-safety', name: 'FDA Drug Safety', url: 'https://www.fda.gov/rss', category: 'Medicine' },
  { id: 'epa-news', name: 'EPA Newsroom', url: 'https://www.epa.gov/rss', category: 'Environment' },
  { id: 'nist-tech', name: 'NIST News', url: 'https://www.nist.gov/rss', category: 'AI/Tech' },
];

function App() {
  const [sources, setSources] = useState<FeedSource[]>(DEFAULT_SOURCES);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'feed' | 'research'>('feed');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(DEFAULT_SOURCES.map(s => s.id));
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const loadingRef = useRef(false);

  const loadFeeds = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAndProcessFeeds(sources);
      setItems(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load feeds:", err);
      setError("Failed to connect to ingestion engine. Retrying...");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [sources]);

  useEffect(() => {
    loadFeeds();
    const interval = setInterval(loadFeeds, 1000 * 60 * 15); // Refresh every 15 mins
    return () => clearInterval(interval);
  }, [loadFeeds]);

  const handleSelectTopic = (sourceId: string) => {
    setViewMode('feed');
    setSelectedTopicIds([sourceId]);
  };

  const handleSelectAll = () => {
    setViewMode('feed');
    setSelectedTopicIds(sources.map(s => s.id));
  };

  const handleAddFeed = (url: string) => {
    const id = `custom-${Date.now()}`;
    let domain = url;
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        domain = urlObj.hostname.replace('www.', '');
    } catch (e) {
        domain = url;
    }

    const newSource: FeedSource = {
        id,
        name: domain,
        url,
        category: 'Custom Sources'
    };

    setSources(prev => [...prev, newSource]);
    setViewMode('feed');
    setSelectedTopicIds([id]);
  };

  const filteredItems = items
    .filter(item => selectedTopicIds.includes(item.sourceId))
    .filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q);
    })
    .sort((a, b) => {
        const priorityScore = { 'Critical': 3, 'Opportunity': 2, 'FYI': 1 };
        const scoreA = priorityScore[a.status];
        const scoreB = priorityScore[b.status];
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

  const stats = {
    critical: filteredItems.filter(i => i.status === 'Critical').length,
    opportunity: filteredItems.filter(i => i.status === 'Opportunity').length,
    fyi: filteredItems.filter(i => i.status === 'FYI').length,
  };

  const isAllSelected = selectedTopicIds.length === sources.length || (selectedTopicIds.length > 1 && selectedTopicIds.length !== 1);
  const currentSource = !isAllSelected && sources.find(s => s.id === selectedTopicIds[0]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      
      <Sidebar 
        sources={sources} 
        selectedTopics={selectedTopicIds}
        onSelectTopic={handleSelectTopic}
        onSelectAll={handleSelectAll}
        onAddFeed={handleAddFeed}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
      />

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {viewMode === 'feed' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                    {!isAllSelected && (
                        <button 
                            onClick={handleSelectAll}
                            className="p-1 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isAllSelected ? 'Regulatory Feed' : currentSource?.name || 'Feed'}
                    </h2>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                    {lastUpdated 
                        ? `Last sync: ${lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                        : 'Syncing...'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search alerts..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 bg-white"
                    />
                </div>
                <button 
                    onClick={loadFeeds}
                    disabled={loading}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Critical</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded-full">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Opportunities</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.opportunity}</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded-full">
                        <Zap className="w-6 h-6 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">General</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.fyi}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-full">
                        <Info className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
              {loading && items.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Ingesting regulatory updates...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map(item => {
                    const source = sources.find(s => s.id === item.sourceId);
                    return (
                        <FeedCard 
                            key={item.id} 
                            item={item} 
                            sourceName={source ? source.name : 'Unknown Source'} 
                        />
                    );
                })
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-slate-200 border-dashed">
                    <p className="text-slate-500">No matches found.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900">AI Regulatory Assistant</h2>
              <p className="text-slate-500 text-sm mt-1">
                Deep research into Regulation S-X, Schedule II exclusions, and Rule 5-04 specifics.
              </p>
            </div>
            <ResearchAssistant />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
