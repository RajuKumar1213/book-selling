import { NextResponse } from 'next/server';

// Simple status endpoint for the polling-based notification system
export async function GET() {
  return NextResponse.json({ 
    status: 'Notification system active (polling-based)',
    timestamp: new Date()
  });
}
