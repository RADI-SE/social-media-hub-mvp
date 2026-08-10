import {  Settings, LogOut } from 'lucide-react';

export default function SidebarFooter() {
  const user = {
    name: 'My Organization',
    avatar: 'https://www.gravatar.com/avatar/default?d=mp', 
  };

  return (
    <footer className="mt-auto border-t border-gray-200 p-4">
      <div className="flex items-center gap-3">
       
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full bg-gray-200"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
        </div>
 
        <div className="flex gap-1">
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button> 
        </div>
      </div>
    </footer>
  );
}