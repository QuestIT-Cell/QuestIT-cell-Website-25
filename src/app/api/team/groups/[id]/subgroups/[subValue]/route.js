import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamGroup from '@/models/Team';

// Update or delete a subgroup by value
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, value: newValue, members } = body;
    const { id, subValue } = params;

    const group = await TeamGroup.findById(id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    const idx = group.subGroups?.findIndex((sg) => sg.value === subValue);
    if (idx === undefined || idx < 0) return NextResponse.json({ success: false, message: 'Subgroup not found' }, { status: 404 });

    if (typeof title === 'string') group.subGroups[idx].title = title;
    if (typeof newValue === 'string') group.subGroups[idx].value = newValue;
    if (Array.isArray(members)) group.subGroups[idx].members = members;

    await group.save();
    return NextResponse.json({ success: true, message: 'Subgroup updated', data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update subgroup', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const { id, subValue } = params;
    const group = await TeamGroup.findById(id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    const before = group.subGroups?.length || 0;
    group.subGroups = (group.subGroups || []).filter((sg) => sg.value !== subValue);
    if (group.subGroups.length === before) return NextResponse.json({ success: false, message: 'Subgroup not found' }, { status: 404 });

    await group.save();
    return NextResponse.json({ success: true, message: 'Subgroup deleted', data: group });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete subgroup', error: error.message }, { status: 500 });
  }
}
