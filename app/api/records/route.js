import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(){
    try{
    const { userId } = await auth();
       if(!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const records = await db.Record.findMany({
        where: { 
            userId, 
            type : 'STUDY'
        },
        orderBy: { date: 'desc' },
    });
        return NextResponse.json({ records });

    }
    catch(error){
          console.error('Error fetching study records:', error);
            return NextResponse.json({ error: 'Failed to fetch study records' }, { status: 500 });
        }
   
}