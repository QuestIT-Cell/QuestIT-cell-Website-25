import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamGroup from '@/models/Team';

// Helper to find subgroup index
function findSubgroupIndex(group, subValue) {
  return (group.subGroups || []).findIndex((sg) => sg.value === subValue);
}

// Add member(s) to a subgroup
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { members } = body; // array or single object
    const { id, subValue } = params;

    if (!members || (Array.isArray(members) && members.length === 0)) {
      return NextResponse.json({ success: false, message: 'members payload required' }, { status: 400 });
    }

    const group = await TeamGroup.findById(id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    const idx = findSubgroupIndex(group, subValue);
    if (idx < 0) return NextResponse.json({ success: false, message: 'Subgroup not found' }, { status: 404 });

    const toAdd = Array.isArray(members) ? members : [members];
    group.subGroups[idx].members = [...(group.subGroups[idx].members || []), ...toAdd];
    await group.save();

    return NextResponse.json({ success: true, message: 'Members added', data: group.subGroups[idx].members });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add members', error: error.message }, { status: 500 });
  }
}

// Patch/update a single member in a subgroup by email or name
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { match = {}, update = {} } = body; // match: { email? name? }, update: fields
    const { id, subValue } = params;

    if (!match.email && !match.name) {
      return NextResponse.json({ success: false, message: 'match by email or name required' }, { status: 400 });
    }

    const group = await TeamGroup.findById(id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    const idx = findSubgroupIndex(group, subValue);
    if (idx < 0) return NextResponse.json({ success: false, message: 'Subgroup not found' }, { status: 404 });

    const mIdx = (group.subGroups[idx].members || []).findIndex((m) =>
      match.email ? m.email === match.email : m.name === match.name
    );
    if (mIdx < 0) return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });

    group.subGroups[idx].members[mIdx] = { ...group.subGroups[idx].members[mIdx], ...update };
    await group.save();

    return NextResponse.json({ success: true, message: 'Member updated', data: group.subGroups[idx].members[mIdx] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update member', error: error.message }, { status: 500 });
  }
}

// Delete a single member in a subgroup by email or name
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, name } = body;
    const { id, subValue } = params;

    if (!email && !name) {
      return NextResponse.json({ success: false, message: 'email or name required to delete' }, { status: 400 });
    }

    const group = await TeamGroup.findById(id);
    if (!group) return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });

    const idx = findSubgroupIndex(group, subValue);
    if (idx < 0) return NextResponse.json({ success: false, message: 'Subgroup not found' }, { status: 404 });

    const before = group.subGroups[idx].members?.length || 0;
    group.subGroups[idx].members = (group.subGroups[idx].members || []).filter((m) =>
      email ? m.email !== email : m.name !== name
    );
    if ((group.subGroups[idx].members?.length || 0) === before) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    await group.save();
    return NextResponse.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete member', error: error.message }, { status: 500 });
  }
}
