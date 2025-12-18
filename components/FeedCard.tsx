import React from 'react';
import { FeedItem } from '../types';
import Badge from './Badge';
import { ExternalLink, Calendar, Tag } from 'lucide-react';

interface FeedCardProps {
  item: FeedItem;
  sourceName: string;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, sourceName }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getBorderColor = () => {
    switch (item.status) {
      case 'Critical': return 'border-l-4 border-l-red-500';
      case 'Opportunity': return 'border-l-4 border-l-yellow-400';
      default: return 'border-l-4 border-l-green-400';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow ${getBorderColor()}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {sourceName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center text-xs text-slate-400">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(item.publishedDate)}
            </span>
        </div>
        <Badge status={item.status} />
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight hover:text-blue-600 transition-colors">
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </h3>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {item.summary}
      </p>

      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div className="flex gap-2">
            {item.keywordsFound.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                    <Tag className="w-3 h-3" />
                    Detected: {item.keywordsFound.join(', ')}
                </div>
            )}
        </div>
        <a 
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Read Source <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default FeedCard;