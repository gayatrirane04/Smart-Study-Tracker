'use server';
import {db} from '@/lib/db';
import {auth} from '@clerk/nextjs/server';

async function getRecords() {
    const {userId}  = await auth(); // get logged in user

    if (!userId) {
        return {error: 'User not found'}; // no login , give error
    }

    try{
        const records = await db.record.findMany({
             where : { userId } ,
             orderBy : {date:'desc'}, // order by date descending
             take : 10,
        });
        return {records}; // return records
    }
    catch(err){
        console.error('Error fetching records:', err);
        return {error: 'Failed to fetch records'};
    }
}

export default getRecords;


