import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Events';
import { requireAdmin } from '@/lib/admin-auth';

const normalizeSpeakers = (rawSpeakers = []) => {
  if (!Array.isArray(rawSpeakers)) return [];

  return rawSpeakers
    .filter((speaker) => speaker && speaker.name && speaker.designation && speaker.image)
    .map((speaker, idx) => ({
      id: speaker.id ?? idx + 1,
      name: speaker.name,
      designation: speaker.designation,
      image: speaker.image,
    }));
};

export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: events,
        count: events.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching events data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch events data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();

    const body = await request.json();
    const { date, title, image, description, speakers = [] } = body || {};

    if (!date || !title || !image || !description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: date, title, image, description',
        },
        { status: 400 }
      );
    }

    const normalizedSpeakers = normalizeSpeakers(speakers);

    const event = await Event.create({ date, title, image, description, speakers: normalizedSpeakers });

    return NextResponse.json(
      {
        success: true,
        message: 'Event created',
        data: event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create event',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
