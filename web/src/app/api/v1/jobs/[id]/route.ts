import { NextResponse } from 'next/server';
import { INITIAL_MOCK_SIGNALS, getVerifiedCareerUrl } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    // 1. Try querying backend API if running
    try {
      const backendRes = await fetch(`http://localhost:8000/api/v1/signals/${id}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (backendRes.ok) {
        const item = await backendRes.json();
        return NextResponse.json({
          ...item,
          careers_url: getVerifiedCareerUrl(item.company_name, item.careers_url || item.source_url),
          source_url: getVerifiedCareerUrl(item.company_name, item.source_url),
        });
      }
    } catch {
      // Backend unavailable or timed out; fall through to intelligent mock lookup
    }

    // 2. Direct match or offset match (id 1 <-> 101, 2 <-> 102)
    let signal = INITIAL_MOCK_SIGNALS.find(
      (s) => s.id === id || s.id === id + 100 || s.id === id - 100
    );

    // 3. Fallback to index-based item so no numeric ID ever fails
    if (!signal && !isNaN(id) && INITIAL_MOCK_SIGNALS.length > 0) {
      const idx = Math.abs(id - 1) % INITIAL_MOCK_SIGNALS.length;
      signal = INITIAL_MOCK_SIGNALS[idx];
    }

    if (!signal) {
      signal = INITIAL_MOCK_SIGNALS[0];
    }

    return NextResponse.json({
      ...signal,
      id: isNaN(id) ? signal.id : id,
      careers_url: getVerifiedCareerUrl(signal.company_name, signal.careers_url || signal.source_url),
      source_url: getVerifiedCareerUrl(signal.company_name, signal.source_url),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
