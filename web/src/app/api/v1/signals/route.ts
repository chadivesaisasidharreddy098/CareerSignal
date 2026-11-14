import { NextResponse } from 'next/server';
import { INITIAL_MOCK_SIGNALS } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const signalType = searchParams.get('signal_type');
    const country = searchParams.get('country');
    const company = searchParams.get('company');
    const search = searchParams.get('search');

    // First attempt to proxy to backend if running
    try {
      const backendRes = await fetch(`http://localhost:8000/api/v1/signals?${searchParams.toString()}`, {
        cache: 'no-store',
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend proxy fallback
    }

    // Next.js fallback filtering
    let items = [...INITIAL_MOCK_SIGNALS];
    if (signalType && signalType !== 'all') {
      items = items.filter((s) => s.signal_type === signalType);
    }
    if (country) {
      items = items.filter((s) => s.country?.toLowerCase().includes(country.toLowerCase()));
    }
    if (company) {
      items = items.filter((s) => s.company_name?.toLowerCase().includes(company.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.company_name?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q) ||
          s.summary?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      total: items.length,
      page: 1,
      page_size: 20,
      items,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
