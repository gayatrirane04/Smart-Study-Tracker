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
        type: 'DIET'
      },
      orderBy: { date: 'desc' },
      take: 7
    });

    return NextResponse.json({ entries: records });
  } catch (error) {
    console.error('Error fetching diet data:', error);
    return NextResponse.json({ error: 'Failed to fetch diet data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calories } = await request.json();
    const today = new Date().toISOString().split('T')[0];

    // Create or update today's diet record
    await db.Record.upsert({
      where: {
        userId_date_type: {
          userId: userId,
          date: new Date(today),
          type: 'DIET'
        }
      },
      update: {
        amount: parseFloat(calories)
      },
      create: {
        userId: userId,
        date: new Date(today),
        type: 'DIET',
        amount: parseFloat(calories)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving diet:', error);
    return NextResponse.json({ error: 'Failed to save diet' }, { status: 500 });
  }
}