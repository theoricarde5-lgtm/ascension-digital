import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const normalize = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

export default async function(req) {
  try {
    const body = await req.json();
    const matricule = normalize(body?.matricule);
    const password = body?.password || '';
    if (!matricule) return Response.json({ ok: false, error: 'Matricule requis' }, { status: 401 });

    const base44 = createClientFromRequest(req);
    const comptes = await base44.asServiceRole.entities.Compte.filter({ matricule });
    const compte = comptes[0];
    if (!compte) return Response.json({ ok: false, error: 'Matricule inconnu' }, { status: 401 });
    if (password !== compte.password) return Response.json({ ok: false, error: 'Mot de passe incorrect' }, { status: 401 });

    return Response.json({ ok: true, user: { matricule: compte.matricule, nom: compte.nom, role: compte.role } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}