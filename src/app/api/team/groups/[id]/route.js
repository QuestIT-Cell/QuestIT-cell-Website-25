import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamGroup from '@/models/Team';

// Get a single group by id
export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const group = await TeamGroup.findById(params.id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get group', error: error.message }, { status: 500 });
  }
}

// Update basic fields (title/value/members/subGroups replacement if provided)
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const updates = await request.json();
    const group = await TeamGroup.findById(params.id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    // Allow updating value/title and wholesale replacement of arrays if explicitly provided
    if (typeof updates.value === 'string') group.value = updates.value;
    if (typeof updates.title === 'string') group.title = updates.title;
    if (Array.isArray(updates.members)) group.members = updates.members;
    if (Array.isArray(updates.subGroups)) group.subGroups = updates.subGroups;

    await group.save();
    return NextResponse.json({ success: true, message: 'Group updated', data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update group', error: error.message }, { status: 500 });
  }
}

// Delete group
export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const result = await TeamGroup.findByIdAndDelete(params.id);
    if (!result) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete group', error: error.message }, { status: 500 });
  }
}
