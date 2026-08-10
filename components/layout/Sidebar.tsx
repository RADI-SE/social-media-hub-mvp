'use client';

import Link from 'next/link';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import { useSocialAccounts } from '@/hooks/useSocialAccounts'; 

export default function Sidebar() { 
  const { accounts, isLoading } = useSocialAccounts();

  return (
    <aside className="flex flex-col h-screen w-64 border-r border-gray-200 bg-white">
       <SidebarHeader />

       <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Connected Accounts
          </span>
          <Link
            href="/settings/social-accounts"
            className="text-xs text-blue-600 hover:underline"
          >
            Manage
          </Link>
        </div>

        {isLoading ? (
          <div className="text-xs text-gray-400">Loading…</div>
        ) : accounts && accounts.length > 0 ? (
          <ul className="space-y-1">
            {accounts.map((acc) => (
              <li key={acc._id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>{acc.accountName}</span>
                <span className="text-xs text-gray-400">({acc.platform})</span>
              </li>
            ))}
          </ul>
        ) : (
          <Link
            href="/settings/social-accounts"
            className="block text-sm text-blue-600 hover:underline"
          >
            + Connect your first account
          </Link>
        )}
      </div>

       <SidebarFooter />
    </aside>
  );
}