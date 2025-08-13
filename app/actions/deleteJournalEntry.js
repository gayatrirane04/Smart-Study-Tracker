'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function deleteJournalEntry(entryId) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    // Delete only if entry belongs to current user
    await db.JournalEntry.delete({
      where: {
        id: entryId,
        userId: userId
      }
    });

    revalidatePath('/journal');
    return { success: true };
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return { error: 'Failed to delete entry' };
  }
}

export default deleteJournalEntry;