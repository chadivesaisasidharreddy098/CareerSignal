import { NextResponse } from 'next/server';
import { INITIAL_MOCK_SIGNALS, computeLocalStats } from '@/lib/api';

export async function GET() {
  try {
    try {
      const backendRes = await fetch('http://localhost:8000/api/v1/signals/stats', {
        cache: 'no-store',
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {}

    return NextResponse.json(computeLocalStats(INITIAL_MOCK_SIGNALS));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
