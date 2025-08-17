import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { weight, height, age, gender, activityLevel , sleepGoal} = await request.json();

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

    // Update user profile
    await db.User.update({
      where: { clerkUserId: userId },
      data: {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        sleepGoal: parseFloat(sleepGoal),
        gender,
        activityLevel
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { weight, height, age, gender, activityLevel , sleepGoal} = await request.json();

    // Update user profile in database
    await db.User.update({
      where: { clerkUserId: userId },
      data: {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        sleepGoal: parseFloat(sleepGoal),
        gender,
        activityLevel
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.User.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate BMR and daily calorie needs
    let bmr = 0;
    if (user.weight && user.height && user.age && user.gender) {
      if (user.gender === 'Male') {
        bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
      } else {
        bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
      }

      // Activity multipliers
      const activityMultipliers = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'Active': 1.725,
        'Very Active': 1.9
      };

      const dailyCalories = Math.round(bmr * (activityMultipliers[user.activityLevel] || 1.2));
      
      return NextResponse.json({ 
        user, 
        bmr: Math.round(bmr),
        dailyCalories 
      });
    }

    return NextResponse.json({user});
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}