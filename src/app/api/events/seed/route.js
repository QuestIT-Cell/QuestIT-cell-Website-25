import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Events';
import events from '@/constants/events';

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data (optional - remove if you want to keep existing data)
    await Event.deleteMany({});

    // Insert all events data
    const result = await Event.insertMany(events);

    return NextResponse.json(
      {
        success: true,
        message: 'Events data added successfully',
        count: result.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding events data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add events data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
