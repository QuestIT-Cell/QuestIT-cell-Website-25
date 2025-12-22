import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { password } = await req.json();
    const secret = process.env.ADMIN_SECRET || '';

    if (!secret) {
      return NextResponse.json(
        { success: false, message: 'ADMIN_SECRET not configured on server' },
        { status: 500 }
      );
    }

    if (!password || password !== secret) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Hash secret to store in cookie (avoid storing raw secret)
    const hash = crypto.createHash('sha256').update(secret).digest('hex');

    const res = NextResponse.json({ success: true, message: 'Signed in' });
    res.cookies.set('admin', hash, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // allow non-HTTPS in dev so cookie is set
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Login failed', error: error.message }, { status: 500 });
  }
}
