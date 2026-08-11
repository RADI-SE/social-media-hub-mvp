import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { currentPassword, newPassword } = await req.json();

         if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Missing current or new password' },
                { status: 400 }
            );
        }
 
        const client = await clerkClient();
        await client.users.updateUser(userId, {
            password: newPassword,
        }); 

        const verification = await client.users.verifyPassword({
            userId,
            password: currentPassword,
        });

        if (!verification.verified) {
            return NextResponse.json(
                { error: 'Current password is incorrect', code: 'form_password_incorrect' },
                { status: 400 }
            );
        }
 
        await client.users.updateUser(userId, {
            password: newPassword,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Password update API error:', error);
 
        if (error.errors?.[0]?.code === 'form_password_incorrect') {
            return NextResponse.json(
                { error: 'Current password is incorrect', code: 'form_password_incorrect' },
                { status: 400 }
            );
        }

        if (error.errors?.[0]?.code === 'additional_verification_required') {
            return NextResponse.json(
                { error: 'Additional verification required', code: 'additional_verification_required' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Could not update password' },
            { status: 500 }
        );
    }
}