import crypto from 'crypto';
import { NextResponse } from 'next/server';

const buildUnauthorized = () =>
  NextResponse.json(
    { success: false, message: 'Unauthorized' },
    { status: 401 }
  );

export function isAdminAuthorized(request) {
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret) return false;

  const adminCookie = request.cookies.get('admin')?.value || '';
  if (!adminCookie) return false;

  const expected = crypto.createHash('sha256').update(secret).digest('hex');
  return adminCookie === expected;
}

export function requireAdmin(request) {
  return isAdminAuthorized(request) ? null : buildUnauthorized();
}
