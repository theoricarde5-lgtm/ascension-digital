import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { waitUntil } from 'base44:runtime';

const normalize = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

const getIp = (req) => {
  const headers = req.headers || {};
  return String(headers.get('x-forwarded-for') || headers.get('x-real-ip') || headers.get('cf-connecting-ip') || '').split(',')[0].trim();
};

export default async function(req) {
  let base44;
  let matricule = '';
  let nom = '';
  let succes = false;
  try {
    const body = await req.json();
    matricule = normalize(body?.matricule);
    const password = body?.password || '';
    if (!matricule) return Response.json({ ok: false, error: 'Matricule requis' }, { status: 401 });

    base44 = createClientFromRequest(req);
    const comptes = await base44.asServiceRole.entities.Compte.filter({ matricule });
    const compte = comptes[0];
    if (!compte) {
      waitUntil(base44.asServiceRole.entities.IpLog.create({
        matricule, nom: '', ip: getIp(req),
        user_agent: String(req.headers?.get('user-agent') || ''),
        succes: false
      }));
      return Response.json({ ok: false, error: 'Matricule inconnu' }, { status: 401 });
    }
    if (password !== compte.password) {
      waitUntil(base44.asServiceRole.entities.IpLog.create({
        matricule, nom: compte.nom, ip: getIp(req),
        user_agent: String(req.headers?.get('user-agent') || ''),
        succes: false
      }));
      return Response.json({ ok: false, error: 'Mot de passe incorrect' }, { status: 401 });
    }

    nom = compte.nom;
    succes = true;
    waitUntil(base44.asServiceRole.entities.IpLog.create({
      matricule, nom: compte.nom, ip: getIp(req),
      user_agent: String(req.headers?.get('user-agent') || ''),
      succes: true
    }));

    return Response.json({ ok: true, user: { matricule: compte.matricule, nom: compte.nom, role: compte.role, couleur: compte.couleur, photo: compte.photo } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}