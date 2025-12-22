import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamGroup from '@/models/Team';

// List all groups
export async function GET() {
  try {
    await dbConnect();
    const groups = await TeamGroup.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: groups, count: groups.length });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to list groups', error: error.message }, { status: 500 });
  }
}

// Create a new council group
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { value, title, members = [], subGroups } = body;

    if (!value || !title) {
      return NextResponse.json({ success: false, message: 'value and title are required' }, { status: 400 });
    }

    // If subGroups not provided, initialize BE/TE/SE
    const defaultSubGroups = [
      { value: 'BE Members', title: 'BE Members', members: [] },
      { value: 'TE Members', title: 'TE Members', members: [] },
      { value: 'SE Members', title: 'SE Members', members: [] },
    ];

    const group = await TeamGroup.create({ value, title, members, subGroups: subGroups ?? defaultSubGroups });

    return NextResponse.json({ success: true, message: 'Council created', data: group }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create council', error: error.message }, { status: 500 });
  }
}
