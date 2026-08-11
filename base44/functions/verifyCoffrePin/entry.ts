import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';
    if (!pin) return Response.json({ valid: false });

    const expected = (secrets.get('COFFRE_PIN') || '').toString().trim();
    if (!expected) return Response.json({ error: 'PIN non configuré' }, { status: 500 });

    return Response.json({ valid: pin === expected });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}