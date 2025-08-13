'use server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function addJournalEntry(formData) {
  const content = formData.get('content');

  if (!content || content.trim() === '') {
    return { error: 'Content is required' };
  }

  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  // Ensure user exists in database
  let dbUser = await db.User.findUnique({
    where: { clerkUserId: userId }
  });

  if (!dbUser) {
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
    const entry = await db.JournalEntry.create({
      data: {
        content: content.trim(),
        userId
      }
    });

    revalidatePath('/journal');
    return { data: entry };
  } catch (error) {
    console.error('Error adding journal entry:', error);
    return { error: `Database error: ${error.message}` };
  }
}

export default addJournalEntry;