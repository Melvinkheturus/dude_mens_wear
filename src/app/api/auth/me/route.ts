import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    }

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(null, { status: 500 });
  }
}