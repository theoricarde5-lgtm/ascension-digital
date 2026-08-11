import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const eventType = body?.event_type;
    const outil = body?.outil || {};

    if (!outil.nom) {
      return Response.json({ error: 'outil.nom requis' }, { status: 400 });
    }

    const prix = Number(outil.prix) || 0;
    const quantite = Number(outil.quantite) || 0;
    const montant = prix * quantite;

    // Achat d'outil => l'argent sort du coffre (retrait)
    // Suppression/vente d'outil => l'argent revient au coffre (depot)
    const isCreate = eventType === 'create';
    const type = isCreate ? 'retrait' : 'depot';
    const note = `${isCreate ? 'Achat' : 'Sortie'} outil : ${outil.nom}${outil.categorie ? ` (${outil.categorie})` : ''}`;

    const movement = await base44.asServiceRole.entities.Movement.create({
      type,
      montant,
      note
    });

    return Response.json({ ok: true, movement_id: movement.id, type, montant });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}