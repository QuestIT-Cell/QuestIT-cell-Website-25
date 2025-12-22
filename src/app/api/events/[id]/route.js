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

export async function PUT(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Event id is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { date, title, image, description, speakers } = body || {};

    const update = {};
    if (date) update.date = date;
    if (title) update.title = title;
    if (image) update.image = image;
    if (description) update.description = description;
    if (speakers) update.speakers = normalizeSpeakers(speakers);

    const event = await Event.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Event updated', data: event },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update event', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Event id is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const result = await Event.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Event deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete event', error: error.message },
      { status: 500 }
    );
  }
}
