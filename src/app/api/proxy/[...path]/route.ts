import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, await params, 'GET');
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, await params, 'POST');
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, await params, 'PUT');
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(req, await params, 'DELETE');
}

async function proxy(req: NextRequest, params: { path: string[] }, method: string) {
    const path = params.path.join('/');
    const search = req.nextUrl.search ?? '';
    const url = `${API_BASE}/${path}${search}`;

    const token = req.headers.get('token') ?? '';
    const contentType = req.headers.get('content-type') ?? 'application/json';

    const headers: Record<string, string> = {
        'Content-Type': contentType,
    };
    if (token) headers['token'] = token;

    let body: string | undefined;
    if (method === 'POST' || method === 'PUT') {
        try { body = await req.text(); } catch { /* ignore */ }
    }

    try {
        const upstream = await fetch(url, {
            method,
            headers,
            ...(body ? { body } : {}),
        });

        const text = await upstream.text();
        let data: unknown;
        try {
            data = JSON.parse(text);
        } catch {
            // upstream returned non-JSON (HTML error page etc.)
            data = { message: text || 'Upstream error', status: 'fail' };
        }

        return NextResponse.json(data, { status: upstream.status });
    } catch (err) {
        console.error('[Proxy] Fetch failed:', err);
        return NextResponse.json(
            { message: 'Proxy fetch error', error: String(err), status: 'fail' },
            { status: 502 }
        );
    }
}
