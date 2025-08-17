'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

async function getUserRecord() {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const records = await db.Record.findMany({
      where: { userId ,
        type : 'STUDY' ,
        date:{
          gte:new Date(Date.now()-7*24*60*60*1000)
        }// Ensure we are fetching study records
      },
    });

    const record = records.reduce((sum, record) => sum + record.amount, 0);

    // Count the number of days with valid sleep records
    const daysWithRecords = records.filter(
      (record) => record.amount > 0
    ).length;

    return { record, daysWithRecords };
  } catch (error) {
    console.error('Error fetching user record:', error);
    return { error: 'Database error' };
  }
}

export default getUserRecord;
