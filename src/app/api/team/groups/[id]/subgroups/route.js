import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamGroup from '@/models/Team';

// Add a new subgroup to the group
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { value, title } = body;

    if (!value || !title) {
      return NextResponse.json({ success: false, message: 'value and title are required' }, { status: 400 });
    }

    const group = await TeamGroup.findById(params.id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    const exists = group.subGroups?.some((sg) => sg.value === value);
    if (exists) return NextResponse.json({ success: false, message: 'Subgroup already exists' }, { status: 409 });

    group.subGroups = group.subGroups || [];
    group.subGroups.push({ value, title, members: [] });
    await group.save();

    return NextResponse.json({ success: true, message: 'Subgroup added', data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add subgroup', error: error.message }, { status: 500 });
  }
}
