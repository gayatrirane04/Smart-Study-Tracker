import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const records = await db.Record.findMany({
      where: { 
        userId: userId,
        type: 'MOOD'
      },
      orderBy: { date: 'desc' },
      take: 7
    });

    return NextResponse.json({ entries: records });
  } catch (error) {
    console.error('Error fetching mood data:', error);
    return NextResponse.json({ error: 'Failed to fetch mood data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating } = await request.json();
    const today = new Date().toISOString().split('T')[0];

    // Create or update today's mood record
    await db.Record.upsert({
      where: {
        userId_date_type: {
          userId: userId,
          date: new Date(today),
          type: 'MOOD'
        }
      },
      update: {
        amount: parseFloat(rating)
      },
      create: {
        userId: userId,
        date: new Date(today),
        type: 'MOOD',
        amount: parseFloat(rating)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving mood:', error);
    return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 });
  }
}