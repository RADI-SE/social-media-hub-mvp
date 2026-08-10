 import { SocialAccount } from '@/types/social-account';

 export async function getSocialAccounts(): Promise<SocialAccount[]> {
   return [
    { _id: '1', userId: 'user1', platform: 'Twitter', accountName: '@mybrand' },
    { _id: '2', userId: 'user1', platform: 'Facebook', accountName: 'My Page' },
  ];
 
}