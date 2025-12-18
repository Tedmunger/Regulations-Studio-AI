
import React, { useState } from 'react';
import { FeedSource } from '../types';
import { Filter, Rss, Plus, Check, Loader2, Layers, Search, Sparkles } from 'lucide-react';
import { findFeedUrl } from '../services/ingestor';

interface SidebarProps {
  sources: FeedSource[];
  selectedTopics: string[];
  onSelectTopic: (topicId: string) => void;
  onSelectAll: () => void;
  onAddFeed: (url: string) => void;
  viewMode: 'feed' | 'research';
  onSetViewMode: (mode: 'feed' | 'research') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sources, 
  selectedTopics, 
  onSelectTopic, 
  onSelectAll, 
  onAddFeed,
  viewMode,
  onSetViewMode
}) => {
  const [newUrl, setNewUrl] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = Array.from(new Set(sources.map(s => s.category)));
  const isAllSelected = sources.length > 0 && selectedTopics.length === sources.length;

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsDiscovering(true);
    setDiscoveryStatus('idle');

    try {
      const feedUrl = await findFeedUrl(newUrl);
      if (feedUrl) {
        onAddFeed(feedUrl); 
        setDiscoveryStatus('success');
        setTimeout(() => {
            setNewUrl('');
            setDiscoveryStatus('idle');
        }, 2000);
      } else {
        setDiscoveryStatus('error');
      }
    } catch (err) {
      setDiscoveryStatus('error');
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 min-h-screen md:sticky md:top-0 h-full overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 text-white">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Rss className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Forefront</h1>
        </div>

        {/* Main Navigation */}
        <div className="mb-8 space-y-1">
          <h2 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider px-3">Navigation</h2>
          <button
            onClick={() => onSetViewMode('feed')}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'feed'
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Alert Feed
          </button>
          <button
            onClick={() => onSetViewMode('research')}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'research'
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Research
          </button>
        </div>

        {/* Discovery Section - Only show if in Feed mode */}
        {viewMode === 'feed' && (
          <div className="mb-8">
              <h2 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider px-3">Add Source</h2>
              <form onSubmit={handleDiscover} className="space-y-2 px-3">
                  <div className="relative">
                      <input 
                          type="text"
                          placeholder="e.g. nasa.gov"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {isDiscovering && (
                          <Loader2 className="absolute right-2 top-2.5 w-4 h-4 animate-spin text-blue-500" />
                      )}
                  </div>
                  <button 
                      type="submit"
                      disabled={isDiscovering || !newUrl}
                      className="w-full flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium py-2 rounded-md transition-colors border border-slate-700"
                  >
                      <Plus className="w-3 h-3" /> Discover Feed
                  </button>
                  {discoveryStatus === 'success' && <p className="text-xs text-green-400 flex items-center mt-1"><Check className="w-3 h-3 mr-1"/> Feed added!</p>}
                  {discoveryStatus === 'error' && <p className="text-xs text-red-400 mt-1">No RSS found.</p>}
              </form>
          </div>
        )}

        {/* Filters - Only show if in Feed mode */}
        {viewMode === 'feed' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-3">
              <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Following</h2>
              <Filter className="w-3 h-3 text-slate-500" />
            </div>

            <div className="mb-4 px-3">
               <button
                  onClick={onSelectAll}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isAllSelected
                      ? 'bg-slate-800 text-blue-400 border border-slate-700' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  All Updates
                </button>
            </div>
            
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">{category}</h3>
                  <div className="space-y-1">
                    {sources.filter(s => s.category === category).map(source => {
                      const isSelected = selectedTopics.includes(source.id);
                      const isOnlySelected = isSelected && selectedTopics.length === 1;
                      const isActive = isOnlySelected; 

                      return (
                        <button
                          key={source.id}
                          onClick={() => onSelectTopic(source.id)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive 
                              ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{source.name}</span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 px-6">
            <p>Regulatory Alert System MVP</p>
            <p className="mt-1">© 2024 Forefront</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
