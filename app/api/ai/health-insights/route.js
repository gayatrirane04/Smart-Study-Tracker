import { generateHealthInsights } from '@/lib/aiService';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let studyRecords, sleepRecords, dietRecords, moodRecords; 
    try{
        studyRecords = await db.Record.findMany({
            where:{
                userId : userId,
                type :'STUDY'
            },
            orderBy : {date:'desc'},
            take:30
        });
         sleepRecords = await db.Record.findMany({
            where:{
                userId : userId,
                type :'SLEEP'
            },
            orderBy : {date:'desc'},
            take:30
        });
         dietRecords = await db.Record.findMany({
            where:{
                userId : userId,
                type :'DIET'
            },
            orderBy : {date:'desc'},
            take:30
        });
         moodRecords = await db.Record.findMany({
            where:{
                userId : userId,
                type :'MOOD'
            },
            orderBy : {date:'desc'},
            take:30
        });
    }catch(error){
        console.error('Error generating health insights:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const allHealthData = {
       study:studyRecords,
       sleep:sleepRecords,
       diet:dietRecords,
       mood :moodRecords
    };
    
    try{
       const insights = await generateHealthInsights(allHealthData);
       return NextResponse.json( insights);
    }
      catch(error){
      console.error('Error generating health insights:', error);
      return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }

}