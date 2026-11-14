import { NextResponse } from 'next/server';
import { INITIAL_MOCK_SIGNALS, computeLocalGeoJSON } from '@/lib/api';

export async function GET() {
  try {
    try {
      const backendRes = await fetch('http://localhost:8000/api/v1/signals/map', {
        cache: 'no-store',
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {}

    return NextResponse.json(computeLocalGeoJSON(INITIAL_MOCK_SIGNALS));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
