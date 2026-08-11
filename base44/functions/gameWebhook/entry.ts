import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    // Webhook entrant : pas d'utilisateur authentifie, on utilise le service role
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const jeu = body?.jeu;
    const eventType = body?.event_type;

    if (!jeu || !eventType) {
      return Response.json({ error: 'Champs requis: jeu, event_type' }, { status: 400 });
    }

    const event = await base44.asServiceRole.entities.GameEvent.create({
      jeu,
      event_type: eventType,
      joueur: body?.joueur || '',
      score: Number(body?.score) || 0,
      donnees: body?.donnees ? JSON.stringify(body.donnees) : ''
    });

    return Response.json({ ok: true, event_id: event.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}