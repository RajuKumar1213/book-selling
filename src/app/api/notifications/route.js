import { NextResponse } from 'next/server';
import { getPendingNotifications } from '@/lib/socket';

export async function GET() {
  try {
    const notifications = getPendingNotifications();
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return NextResponse.json({ notifications: [] });
  }
}
