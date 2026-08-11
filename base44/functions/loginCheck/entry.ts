import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const USERS = [
  { matricule: 'JD', nom: 'Julio Delgado', role: 'Patron' },
  { matricule: 'PH', nom: 'Paco Hernandez', role: 'Co-Patron' },
  { matricule: 'ZS', nom: 'Zéphyr Sterling', role: 'Responsable Event' },
  { matricule: 'KD', nom: 'Keyla Delgado', role: 'Responsable' },
  { matricule: 'SU', nom: 'Shkëlze Uka', role: 'Responsable' },
  { matricule: 'DF', nom: 'Demetrius Flenory', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'IB', nom: 'Issa Blackys', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'JM', nom: 'Jason Montelis', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'MR', nom: 'Malik Reed', role: 'Vendeur/euse Supérieur(e)' },
  { matricule: 'JC', nom: 'Joe Cortes', role: 'Vendeur/euse' },
  { matricule: 'SV', nom: 'Soren Veyron', role: 'Vendeur/euse' },
  { matricule: 'HH', nom: 'Hakime Hernandez', role: 'Vendeur/euse Novice' },
  { matricule: 'IU', nom: 'Isalia Uka', role: 'Vendeur/euse Novice' },
  { matricule: 'NN', nom: 'Noah Norev', role: 'Vendeur/euse Novice' },
  { matricule: 'SW', nom: 'Stella West', role: 'Vendeur/euse Novice' },
  { matricule: 'JW', nom: 'Jordan Wallace', role: 'Vendeur/euse Novice' },
];

const PASSWORD = 'ls2026';

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