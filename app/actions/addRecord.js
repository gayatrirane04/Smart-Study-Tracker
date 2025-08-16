'use server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function addSleepRecord(formData) {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');
  const dateValue = formData.get('date');

  // Check for input values
  if (
    !textValue ||
    textValue === '' ||
    !amountValue ||
    !dateValue ||
    dateValue === ''
  ) {
    return { error: 'Text, amount, or date is missing' };
  }

  const text = textValue.toString();
  const amount = parseFloat(amountValue.toString());
  
  // Convert date to ISO-8601 format
  let date;
  try {
    date = new Date(dateValue.toString()).toISOString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return { error: 'Invalid date format' };
  }

  // Get logged in user
  const { userId } = await auth();

  // Check for user
  if (!userId) {
    return { error: 'User not found' };
  }

  // Ensure user exists in database
  let dbUser = await db.User.findUnique({
    where: { clerkUserId: userId }
  });

  if (!dbUser) {
    // Create user if doesn't exist
    const clerkUser = await currentUser();
    dbUser = await db.User.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        imageUrl: clerkUser.imageUrl
      }
    });
  }

  try {
    // Check if a record with the same date already exists
    const existingRecord = await db.Record.findFirst({
      where: {
        userId,
        date: date,
        type: 'STUDY'
      },
    });

    let recordData;

    if (existingRecord) {
      // Update the existing record
      const updatedRecord = await db.Record.update({
        where: { id: existingRecord.id },
        data: {
          text,
          amount,
        },
      });

      recordData = {
        text: updatedRecord.text,
        amount: updatedRecord.amount,
        date: updatedRecord.date?.toISOString() || date,
      };
    } else {
      // Create a new record
      const createdRecord = await db.Record.create({
        data: {
          text,
          amount,
          date,
          userId,
          type: 'STUDY'
        },
      });

      recordData = {
        text: createdRecord.text,
        amount: createdRecord.amount,
        date: createdRecord.date?.toISOString() || date,
      };
    }

    revalidatePath('/');

    return { data: recordData };
  } catch (error) {
    console.error('Error adding sleep record:', error);
    return {
      error: `Database error: ${error.message}`,
    };
  }
}

export { addSleepRecord };
export default addSleepRecord;