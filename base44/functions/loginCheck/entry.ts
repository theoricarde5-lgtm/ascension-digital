import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const USERS = [
  { matricule: 'FERNANDO', nom: 'Fernando', role: 'Dev' },
];

const PASSWORD = '0185';

export default async function(req) {
  try {
    const body = await req.json();
    const matricule = String(body?.matricule || '').toUpperCase().trim();
    const password = body?.password || '';
    const user = USERS.find(u => u.matricule === matricule);
    if (!user) return Response.json({ ok: false, error: 'Matricule inconnu' }, { status: 401 });
    if (password !== PASSWORD) return Response.json({ ok: false, error: 'Mot de passe incorrect' }, { status: 401 });
    return Response.json({ ok: true, user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}