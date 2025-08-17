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
        type: 'SLEEP'
      },
      orderBy: { date: 'desc' },
      take: 7
    });

    return NextResponse.json({ entries: records });
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    return NextResponse.json({ error: 'Failed to fetch sleep data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hours } = await request.json();
    const today = new Date().toISOString().split('T')[0];

    // Create or update today's sleep record
    await db.Record.upsert({
      where: {
        userId_date_type: {
          userId: userId,
          date: new Date(today),
          type: 'SLEEP'
        }
      },
      update: {
        amount: parseFloat(hours)
      },
      create: {
        userId: userId,
        date: new Date(today),
        type: 'SLEEP',
        amount: parseFloat(hours)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving sleep:', error);
    return NextResponse.json({ error: 'Failed to save sleep' }, { status: 500 });
  }
}