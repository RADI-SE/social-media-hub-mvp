// hooks/useSocialAccounts.ts
import { useState, useEffect } from 'react';
import { getSocialAccounts } from '../lib/api/social-accounts';
import { SocialAccount } from '@/types/social-account';

export function useSocialAccounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const data = await getSocialAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return { accounts, isLoading, error };
}