

import { useClerk, useUser } from "@clerk/nextjs";
import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SidebarFooter() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();

  const router = useRouter();


  if (!isLoaded) {
    return (
      <footer className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />

          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </footer>
    );
  }

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <footer className="mt-auto border-t border-gray-200 p-4">
      <div className="flex items-center gap-3">

        <img
          src={user?.imageUrl ?? "/images/default-avatar.png"}
          alt={user?.fullName ?? user?.firstName ?? "User"}
          className="h-8 w-8 rounded-full bg-gray-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-700">
            {user?.fullName ??
              user?.firstName ??
              "User"}
          </p>

          {user?.primaryEmailAddress?.emailAddress && (
            <p className="truncate text-xs text-gray-500">
              {user.primaryEmailAddress.emailAddress}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleSettings}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>

          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

