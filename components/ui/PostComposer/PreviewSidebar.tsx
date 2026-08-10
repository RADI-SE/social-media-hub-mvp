'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Info,
  Image, FileText, Layout, Eye 
} from 'lucide-react';

 
import { FacebookIcon, TwitterIcon } from '../ChannelIcons';  

type Channel = 'facebook' | 'twitter' | 'default';

interface PreviewSidebarProps {
  content?: string;
  initialChannel?: Channel;
}

export function PreviewSidebar({
  content = 'Start writing your post...',
  initialChannel = 'default',
}: PreviewSidebarProps) {
  const [activeChannel, setActiveChannel] = useState<Channel>(initialChannel);

  const tabs: { id: Channel; icon: React.ReactNode }[] = [
    { id: 'default', icon: <Eye className="w-4 h-4" /> },
    { id: 'facebook',icon: <FacebookIcon className="w-4 h-4" /> },
    { id: 'twitter', icon: <TwitterIcon className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col p-4 overflow-y-auto">
   
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
        <Info size={16} className="text-gray-400" />
      </div>

       <div className="flex rounded-md bg-gray-200 p-1 mb-4">
        {tabs.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => setActiveChannel(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeChannel === id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
 
      <div className="flex-1">
        {activeChannel === 'default' && <ByDefault/>}
        {activeChannel === 'facebook' && <FacebookPreview content={content} />}
        {activeChannel === 'twitter' && <TwitterPreview content={content} />}
       </div>
    </aside>
  );
}
 
function FacebookPreview({ content }: { content: string }) {
  const user = {
    name: 'mx',
    avatar: '',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-3">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">Just Now ·</p>
        </div>
        <MoreHorizontal size={16} className="text-gray-400 flex-shrink-0" />
      </div>
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{content}</p>
      </div>
      <div className="flex items-center justify-around border-t border-gray-100 px-2 py-1">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
          <Heart size={16} strokeWidth={1.5} /> <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
          <MessageCircle size={16} strokeWidth={1.5} /> <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
          <Share2 size={16} strokeWidth={1.5} /> <span>Share</span>
        </button>
      </div>
    </div>
  );
}
 
function TwitterPreview({ content }: { content: string }) {
  const user = {
    name: 'njl',
    handle: 'dnj',
    avatar: '',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 p-3">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user.name}
            <span className="text-gray-500 font-normal ml-1">@{user.handle}</span>
          </p>
          <p className="text-xs text-gray-500">Just Now</p>
        </div>
        <MoreHorizontal size={16} className="text-gray-400 flex-shrink-0" />
      </div>
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{content}</p>
      </div>
      <div className="flex items-center justify-around border-t border-gray-100 px-2 py-1">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
          <Heart size={16} strokeWidth={1.5} /> <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
          <MessageCircle size={16} strokeWidth={1.5} /> <span>Reply</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-md">
          <Share2 size={16} strokeWidth={1.5} /> <span>Retweet</span>
        </button>
      </div>
    </div>
  );
}

 

function ByDefault() {
  return (
    <aside className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
            <Image size={40} className="text-gray-400" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <FileText size={16} className="text-gray-500" />
          </div>
        </div>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          See your posts preview here
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Eye size={14} strokeWidth={1.5} />
          <span>Live preview</span>
        </div>
      </div>
    </aside>
  );
}