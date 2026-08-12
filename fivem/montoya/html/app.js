// =========================================================
//  Montoya — NUI standalone (calls published Base44 API)
// =========================================================
const APP_ID = '6a78e21367f0139109c57ae6';
const API = `https://comptamontoya.com/api/apps/${APP_ID}`;

const $ = (sel, el = document) => el.querySelector(sel);
const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'className') node.className = v;
    else if (k === 'onClick') node.addEventListener('click', v);
    else if (k === 'onChange') node.addEventListener('change', v);
    else if (k === 'onSubmit') node.addEventListener('submit', v);
    else if (k === 'style') Object.assign(node.style, v);
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    node.append(c.nodeType ? c : document.createTextNode(c));
  });
  return node;
};

// ---- API ----
async function api(path, { method = 'GET', body, query } = {}) {
  let url = `${API}${path}`;
  if (query) {
    const p = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v !== undefined && v !== null) p.set(k, v); });
    url += `?${p.toString()}`;
  }
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  let data;
  try { data = await res.json(); } catch (e) { data = null; }
  if (!res.ok) throw { status: res.status, data };
  return data;
}
const list = (entity, opts = {}) => api(`/entities/${entity}`, { query: opts });
const filter = (entity, q, opts = {}) => api(`/entities/${entity}`, { query: { q: JSON.stringify(q), ...opts } });
const create = (entity, data) => api(`/entities/${entity}`, { method: 'POST', body: data });
const update = (entity, id, data) => api(`/entities/${entity}/${id}`, { method: 'PUT', body: data });
const remove = (entity, id) => api(`/entities/${entity}/${id}`, { method: 'DELETE' });
const invokeFn = (name, data) => api(`/functions/${name}`, { method: 'POST', body: data });

// ---- State ----
let user = null;
let view = 'dashboard';
let cache = {};

async function loadAll() {
  const [objets, bijoux, categories, catBijoux, movements, outils, catOutils, sources, armes, locations, contrebande] = await Promise.all([
    list('Objet', { sort: '-created_date', limit: 500 }),
    list('Bijou', { sort: '-created_date', limit: 500 }),
    list('Categorie'),
    list('CategorieBijou'),
    list('Movement', { sort: '-created_date', limit: 50 }),
    list('Outil', { sort: '-created_date', limit: 50 }),
    list('CategorieOutil'),
    list('Source'),
    list('Arme', { sort: '-created_date', limit: 50 }),
    list('LocationArme', { sort: '-created_date', limit: 200 }),
    list('Contrebande', { sort: '-created_date', limit: 500 }),
  ]);
  cache = { objets, bijoux, categories, catBijoux, movements, outils, catOutils, sources, armes, locations, contrebande };
}

async function reload(entity) {
  const data = await list(entity, { sort: '-created_date', limit: 500 });
  const key = entity.toLowerCase() === 'objet' ? 'objets'
    : entity.toLowerCase() === 'bijou' ? 'bijoux'
    : entity.toLowerCase() === 'outil' ? 'outils'
    : entity.toLowerCase() === 'arme' ? 'armes'
    : entity.toLowerCase() === 'contrebende' || entity.toLowerCase() === 'contrebande' ? 'contrebande'
    : entity.toLowerCase() === 'movement' ? 'movements'
    : entity.toLowerCase() === 'locationarme' ? 'locations'
    : entity.toLowerCase();
  cache[key] = data;
}

// ---- Auth ----
async function bootLogin() {
  const saved = JSON.parse(localStorage.getItem('ls_user') || 'null');
  if (saved && saved.matricule) { user = saved; await enterApp(); return; }
  renderLogin();
}

function renderLogin() {
  const root = $('#app');
  root.innerHTML = '';
  const card = el('div', { className: 'login-wrap' },
    el('div', { className: 'login-card' }, [
      el('h1', {}, 'Connexion'),
      el('div', { className: 'sub' }, 'Entrez vos identifiants pour accéder au panel.'),
      errBox = el('div', { className: 'err', style: { display: 'none' } }),
      el('form', { onSubmit: async (e) => {
        e.preventDefault();
        errBox.style.display = 'none';
        const m = matInput.value.trim().toUpperCase();
        const p = pwdInput.value;
        if (!m || !p) return;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Connexion...';
        try {
          const res = await invokeFn('loginCheck', { matricule: m, password: p });
          if (res.ok) {
            user = res.user;
            localStorage.setItem('ls_user', JSON.stringify(user));
            await enterApp();
          } else {
            errBox.textContent = res.error || 'Connexion échouée';
            errBox.style.display = 'block';
          }
        } catch (e2) {
          errBox.textContent = (e2 && e2.data && e2.data.error) || 'Connexion échouée';
          errBox.style.display = 'block';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Se connecter';
        }
      } }, [
        el('div', { className: 'field' }, [el('label', {}, 'Matricule'), matInput = el('input', { placeholder: 'Fernando', required: true })]),
        el('div', { className: 'field' }, [el('label', {}, 'Mot de passe'), pwdInput = el('input', { type: 'password', required: true })]),
        submitBtn = el('button', { className: 'btn-primary', type: 'submit' }, 'Se connecter'),
      ]),
    ])
  );
  root.append(card);

  // quick select
  invokeFn ? null : null;
  list('Compte', { sort: '-created_date', limit: 50 }).then(list => {
    if (!list || !list.length) return;
    const grade = { Dev: 0, Teniente: 1, Capitaine: 2, Membre: 3 };
    list.sort((a, b) => (grade[a.role] ?? 9) - (grade[b.role] ?? 9) || a.nom.localeCompare(b.nom));
    const wrap = el('div', {}, [
      el('div', { className: 'quick-label' }, 'Sélection rapide'),
      el('div', { className: 'quick-grid' }, list.map(u => {
        const accent = u.role === 'Dev' ? '#9c27b0' : u.role === 'Teniente' ? '#000' : '#ff473a';
        const grad = u.role === 'Dev' ? '#b561d4' : u.role === 'Teniente' ? '#3a3a3a' : '#ff7a4d';
        const item = el('div', { className: 'quick-item', onClick: () => {
          matInput.value = u.matricule;
          pwdInput.value = '';
          document.querySelectorAll('.quick-item').forEach(n => n.classList.remove('sel'));
          item.classList.add('sel');
          pwdInput.focus();
        } }, [
          el('div', { className: 'quick-avatar', style: { background: u.photo ? '#141417' : `linear-gradient(135deg, ${accent}, ${grad})` } },
            u.photo ? el('img', { src: u.photo }) : u.nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()),
          el('div', {}, [
            el('div', { className: 'quick-name' }, u.nom),
            el('span', { className: 'quick-role', style: { background: `${accent}1f`, color: accent } }, `${u.role === 'Dev' ? '◆' : '●'} ${u.role}`),
          ]),
        ]);
        return item;
      })),
    ]);
    card.querySelector('.login-card').append(wrap);
  }).catch(() => {});
}

async function enterApp() {
  updateUserBadge();
  await loadAll().catch(() => {});
  renderApp();
  navigate('dashboard');
}

function updateUserBadge() {
  $('#userBadge').innerHTML = user ? `<b>${user.nom}</b> · ${user.role}` : '';
}

// ---- Router / nav ----
const NAV = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard' },
  { id: 'objets', icon: '▢', label: 'Objets' },
  { id: 'bijoux', icon: '◆', label: 'Bijoux' },
  { id: 'outils', icon: '🔧', label: 'Outils' },
  { id: 'armes', icon: '⚔', label: 'Armes' },
  { id: 'contrebande', icon: '☣', label: 'Contrebande' },
  { id: 'coffre', icon: '$', label: 'Coffre' },
  { id: 'groupes', icon: '≡', label: 'Groupes' },
];

function renderApp() {
  const root = $('#app');
  root.innerHTML = '';
  const sidebar = el('div', { className: 'sidebar' });
  NAV.forEach(n => {
    const btn = el('button', { className: 'nav-btn' + (view === n.id ? ' active' : ''), title: n.label }, n.icon);
    btn.addEventListener('click', () => navigate(n.id));
    sidebar.append(btn);
    if (n.id === 'dashboard' || n.id === 'contrebande') sidebar.append(el('div', { className: 'nav-sep' }));
  });
  const main = el('div', { className: 'main', id: 'main' });
  root.append(sidebar, main);
}

async function navigate(id) {
  view = id;
  document.querySelectorAll('.nav-btn').forEach((b, i) => b.classList.toggle('active', NAV[i].id === id));
  const main = $('#main');
  main.innerHTML = '<div class="loading">Chargement...</div>';
  try {
    if (id === 'dashboard') await viewDashboard(main);
    else if (id === 'objets') await viewObjets(main);
    else if (id === 'bijoux') await viewBijoux(main);
    else if (id === 'outils') await viewOutils(main);
    else if (id === 'armes') await viewArmes(main);
    else if (id === 'contrebande') await viewContrebande(main);
    else if (id === 'coffre') await viewCoffre(main);
    else if (id === 'groupes') await viewGroupes(main);
  } catch (e) {
    main.innerHTML = '<div class="empty">Erreur de chargement.</div>';
  }
}

// ---- Reusable ----
function toolbar(searchPlaceholder, cats, activeCat, setCat, onSearch, addLabel, onAdd) {
  const wrap = el('div', { className: 'toolbar' });
  const s = el('div', { className: 'search' }, ['🔍 ', el('input', { placeholder: searchPlaceholder })]);
  s.querySelector('input').addEventListener('input', onSearch);
  wrap.append(s);
  const pills = el('div', { className: 'pills' });
  pills.append(el('button', { className: 'pill' + (activeCat === 'Tous' ? ' active' : ''), onClick: () => setCat('Tous') }, 'Tous'));
  cats.forEach(c => pills.append(el('button', { className: 'pill' + (activeCat === c.nom ? ' active' : ''), onClick: () => setCat(c.nom) }, c.nom)));
  wrap.append(pills);
  if (addLabel) wrap.append(el('button', { className: 'btn-add', onClick: onAdd }, ['+ ', addLabel]));
  return wrap;
}

function emptyState(icon, text) {
  return el('div', { className: 'empty' }, `${icon}  ${text}`);
}

function cardGrid(items, renderCard) {
  if (!items.length) return null;
  const grid = el('div', { className: 'grid' });
  items.forEach(it => grid.append(renderCard(it)));
  return grid;
}

// ---- Modal ----
function openModal(title, fields, onSubmit) {
  const bg = el('div', { className: 'modal-bg' });
  const modal = el('div', { className: 'modal' });
  const close = () => bg.remove();
  modal.append(el('button', { className: 'modal-close', onClick: close }, '✕'));
  modal.append(el('h3', {}, title));
  const form = el('form', { onSubmit: async (e) => {
    e.preventDefault();
    const data = {};
    fields.forEach(f => {
      const node = form.querySelector(`[name="${f.name}"]`);
      let v = node.value;
      if (f.type === 'number') v = parseFloat(v) || 0;
      if (f.type === 'int') v = parseInt(v) || 0;
      data[f.name] = v;
    });
    const btn = form.querySelector('.btn-confirm');
    btn.disabled = true; btn.textContent = '...';
    try { await onSubmit(data); close(); } catch (e2) { btn.disabled = false; btn.textContent = 'Enregistrer'; }
  } });

  const grid = el('div', { className: 'modal-grid' });
  fields.forEach(f => {
    const wrap = el('div', { className: f.full ? 'full' : '' });
    wrap.append(el('label', {}, f.label));
    let input;
    if (f.select) {
      input = el('select', { name: f.name });
      input.append(el('option', { value: '' }, '— Choisir —'));
      f.options.forEach(o => input.append(el('option', { value: o.value }, o.label)));
      if (f.value) input.value = f.value;
    } else {
      input = el('input', { name: f.name, type: f.type === 'number' || f.type === 'int' ? 'number' : 'text', placeholder: f.placeholder || '' });
      if (f.value != null) input.value = f.value;
    }
    wrap.append(input);
    grid.append(wrap);
  });
  form.append(grid);
  form.append(el('div', { className: 'modal-actions' }, [
    el('button', { type: 'button', className: 'btn-ghost', onClick: close }, 'Annuler'),
    el('button', { type: 'submit', className: 'btn-confirm' }, 'Enregistrer'),
  ]));
  modal.append(form);
  bg.append(modal);
  bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
  document.body.append(bg);
}

// ---- Dashboard ----
async function viewDashboard(main) {
  const totalUnits = cache.objets.reduce((s, o) => s + (o.quantite || 0), 0);
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, `Bonjour ${user?.nom || ''} 👋`));
  main.append(el('div', { className: 'page-sub' }, 'Voici votre registre d\'objets partagé.'));
  const stats = el('div', { className: 'stats' }, [
    statCard('Objets', cache.objets.length),
    statCard('Unités', totalUnits),
    statCard('Catégories', cache.categories.length),
    statCard('Bijoux', cache.bijoux.length),
    statCard('Outils', cache.outils.length),
    statCard('Armes', cache.armes.length),
  ]);
  main.append(stats);
  // recent objets
  main.append(el('div', { className: 'page-title', style: { fontSize: '17px', marginTop: '10px' } }, 'Objets récents'));
  const recent = cache.objets.slice(0, 6);
  const grid = cardGrid(recent, o => el('div', { className: 'card' }, [
    el('div', { className: 'card-cat' }, o.categorie || 'Sans catégorie'),
    el('div', { className: 'card-name' }, o.nom),
    o.description ? el('div', { className: 'card-desc' }, o.description) : null,
    el('div', { className: 'card-row' }, [el('div', { className: 'card-price' }, o.prix ? `${o.prix} $` : '—'), el('div', { className: 'card-qty' }, o.quantite ? `Qté: ${o.quantite}` : '')]),
  ]));
  main.append(grid || emptyState('▢', 'Aucun objet.'));
}

function statCard(label, value) {
  return el('div', { className: 'stat' }, [el('div', { className: 'stat-label' }, label), el('div', { className: 'stat-value' }, String(value))]);
}

// ---- Objets ----
let objState = { q: '', cat: 'Tous' };
async function viewObjets(main) {
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, 'Registre d\'objets'));
  main.append(el('div', { className: 'page-sub' }, `${cache.objets.length} objet(s)`));
  main.append(toolbar('Rechercher...', cache.categories, objState.cat, c => { objState.cat = c; viewObjets(main); }, e => { objState.q = e.target.value; viewObjets(main); }, 'Ajouter un objet', () => addObjetModal(main)));
  const filtered = cache.objets.filter(o => {
    const mc = objState.cat === 'Tous' || o.categorie === objState.cat;
    const mq = !objState.q || (o.nom || '').toLowerCase().includes(objState.q.toLowerCase());
    return mc && mq;
  });
  const grid = cardGrid(filtered, o => el('div', { className: 'card' }, [
    el('button', { className: 'card-del', onClick: async () => { await remove('Objet', o.id); await reload('Objet'); viewObjets(main); } }, '✕'),
    el('div', { className: 'card-cat' }, o.categorie || 'Sans catégorie'),
    el('div', { className: 'card-name' }, o.nom),
    o.description ? el('div', { className: 'card-desc' }, o.description) : null,
    o.vendeur ? el('div', { className: 'card-vendor' }, `Vendeur: ${o.vendeur}`) : null,
    el('div', { className: 'card-row' }, [el('div', { className: 'card-price' }, o.prix ? `${o.prix} $` : '—'), el('div', { className: 'card-qty' }, o.quantite ? `Qté: ${o.quantite}` : '')]),
  ]));
  main.append(grid || emptyState('▢', 'Aucun objet. Ajoutez votre premier objet.'));
}

function addObjetModal(main) {
  openModal('Ajouter un objet', [
    { name: 'nom', label: 'Nom *', full: true, placeholder: 'Nom de l\'objet' },
    { name: 'categorie', label: 'Catégorie', select: true, options: cache.categories.map(c => ({ value: c.nom, label: c.nom })) },
    { name: 'prix', label: 'Prix ($)', type: 'number', placeholder: '0' },
    { name: 'quantite', label: 'Quantité', type: 'int', placeholder: '0' },
    { name: 'vendeur', label: 'Racheté à', full: true, select: true, options: cache.sources.map(s => ({ value: s.nom, label: s.nom })) },
    { name: 'description', label: 'Description', full: true, placeholder: 'Détails...' },
  ], async (data) => {
    data.nom = data.nom.trim();
    if (!data.nom) return;
    await create('Objet', data);
    await reload('Objet');
    viewObjets(main);
  });
}

// ---- Bijoux ----
let bijState = { q: '', cat: 'Tous' };
async function viewBijoux(main) {
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, 'Bijoux'));
  main.append(el('div', { className: 'page-sub' }, `${cache.bijoux.length} bijou(x)`));
  main.append(toolbar('Rechercher...', cache.catBijoux, bijState.cat, c => { bijState.cat = c; viewBijoux(main); }, e => { bijState.q = e.target.value; viewBijoux(main); }, 'Ajouter un bijou', () => addBijouModal(main)));
  const filtered = cache.bijoux.filter(o => {
    const mc = bijState.cat === 'Tous' || o.categorie === bijState.cat;
    const mq = !bijState.q || (o.nom || '').toLowerCase().includes(bijState.q.toLowerCase());
    return mc && mq;
  });
  const grid = cardGrid(filtered, o => el('div', { className: 'card' }, [
    el('button', { className: 'card-del', onClick: async () => { await remove('Bijou', o.id); await reload('Bijou'); viewBijoux(main); } }, '✕'),
    el('div', { className: 'card-cat' }, o.categorie || 'Sans catégorie'),
    el('div', { className: 'card-name' }, o.nom),
    o.description ? el('div', { className: 'card-desc' }, o.description) : null,
    el('div', { className: 'card-row' }, [el('div', { className: 'card-price' }, o.prix ? `${o.prix} $` : '—'), el('div', { className: 'card-qty' }, o.quantite ? `Qté: ${o.quantite}` : '')]),
  ]));
  main.append(grid || emptyState('◆', 'Aucun bijou.'));
}

function addBijouModal(main) {
  openModal('Ajouter un bijou', [
    { name: 'nom', label: 'Nom *', full: true, placeholder: 'Nom du bijou' },
    { name: 'categorie', label: 'Catégorie', select: true, options: cache.catBijoux.map(c => ({ value: c.nom, label: c.nom })) },
    { name: 'prix', label: 'Prix ($)', type: 'number', placeholder: '0' },
    { name: 'quantite', label: 'Quantité', type: 'int', placeholder: '0' },
    { name: 'description', label: 'Description', full: true, placeholder: 'Détails...' },
  ], async (data) => {
    data.nom = data.nom.trim();
    if (!data.nom) return;
    await create('Bijou', data);
    await reload('Bijou');
    viewBijoux(main);
  });
}

// ---- Outils ----
let outState = { q: '' };
async function viewOutils(main) {
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, 'Stock Outils'));
  main.append(el('div', { className: 'page-sub' }, `${cache.outils.length} outil(s)`));
  const tb = el('div', { className: 'toolbar' });
  const s = el('div', { className: 'search' }, ['🔍 ', el('input', { placeholder: 'Rechercher...', value: outState.q })]);
  s.querySelector('input').addEventListener('input', e => { outState.q = e.target.value; viewOutils(main); });
  tb.append(s);
  tb.append(el('button', { className: 'btn-add', onClick: () => addOutilModal(main) }, '+ Ajouter un outil'));
  main.append(tb);
  const filtered = cache.outils.filter(o => !outState.q || (o.nom || '').toLowerCase().includes(outState.q.toLowerCase()));
  const grid = cardGrid(filtered, o => el('div', { className: 'card' }, [
    el('button', { className: 'card-del', onClick: async () => { await remove('Outil', o.id); await reload('Outil'); viewOutils(main); } }, '✕'),
    el('div', { className: 'card-cat' }, o.categorie || 'Sans catégorie'),
    el('div', { className: 'card-name' }, o.nom),
    el('div', { className: 'card-row' }, [el('div', { className: 'card-price' }, o.prix ? `${o.prix} $` : '—'), el('div', { className: 'card-qty' }, o.quantite ? `Qté: ${o.quantite}` : '')]),
    el('div', { className: 'card-actions' }, [
      el('button', { className: 'btn-sm sell', onClick: () => sellOutilModal(main, o) }, 'Vendre'),
    ]),
  ]));
  main.append(grid || emptyState('🔧', 'Aucun outil.'));
}

function addOutilModal(main) {
  openModal('Ajouter un outil', [
    { name: 'nom', label: 'Nom *', full: true, placeholder: 'Nom de l\'outil' },
    { name: 'categorie', label: 'Catégorie', select: true, options: cache.catOutils.map(c => ({ value: c.nom, label: c.nom })) },
    { name: 'prix', label: 'Prix ($)', type: 'number', placeholder: '0' },
    { name: 'quantite', label: 'Quantité', type: 'int', placeholder: '0' },
    { name: 'description', label: 'Description', full: true, placeholder: 'Détails...' },
  ], async (data) => {
    data.nom = data.nom.trim();
    if (!data.nom) return;
    await create('Outil', data);
    await reload('Outil');
    viewOutils(main);
  });
}

function sellOutilModal(main, o) {
  openModal(`Vendre — ${o.nom}`, [
    { name: 'quantite', label: 'Quantité à vendre', type: 'int', value: 1, placeholder: '1' },
    { name: 'prix', label: 'Prix unitaire ($)', type: 'number', value: o.prix || 0 },
  ], async (data) => {
    const qty = Math.max(1, parseInt(data.quantite) || 1);
    const newQte = Math.max(0, (o.quantite || 0) - qty);
    await update('Outil', o.id, { quantite: newQte, statut: newQte === 0 ? 'Vendu' : (o.statut || 'Disponible') });
    await create('Movement', { type: 'depot', montant: (parseFloat(data.prix) || 0) * qty, note: `Vente outil : ${o.nom} (x${qty})` });
    await reload('Outil');
    await reload('Movement');
    viewOutils(main);
  });
}

// ---- Armes ----
let armState = { q: '' };
async function viewArmes(main) {
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, 'Location Armes'));
  main.append(el('div', { className: 'page-sub' }, `${cache.armes.length} arme(s)`));
  const tb = el('div', { className: 'toolbar' });
  const s = el('div', { className: 'search' }, ['🔍 ', el('input', { placeholder: 'Rechercher...', value: armState.q })]);
  s.querySelector('input').addEventListener('input', e => { armState.q = e.target.value; viewArmes(main); });
  tb.append(s);
  tb.append(el('button', { className: 'btn-add', onClick: () => addArmeModal(main) }, '+ Ajouter une arme'));
  main.append(tb);
  const filtered = cache.armes.filter(o => !armState.q || (o.nom || '').toLowerCase().includes(armState.q.toLowerCase()));
  const grid = cardGrid(filtered, a => el('div', { className: 'card' }, [
    el('button', { className: 'card-del', onClick: async () => { await remove('Arme', a.id); await reload('Arme'); viewArmes(main); } }, '✕'),
    el('div', { className: 'card-cat' }, a.categorie || 'Sans catégorie'),
    el('div', { className: 'card-name' }, a.nom),
    el('div', { className: 'card-row' }, [el('div', { className: 'card-price' }, a.prix_location ? `Loc: ${a.prix_location} $` : '—'), el('div', { className: 'card-qty' }, a.statut || 'Disponible')]),
    a.statut === 'Loué' ? el('div', { className: 'card-vendor' }, `Loué à: ${a.locataire || ''}`) : null,
    el('div', { className: 'card-actions' }, [
      a.statut === 'Disponible'
        ? el('button', { className: 'btn-sm', onClick: () => louerArmeModal(main, a) }, 'Louer')
        : el('button', { className: 'btn-sm sell', onClick: () => rendreArmeModal(main, a) }, 'Rendre'),
    ]),
  ]));
  main.append(grid || emptyState('⚔', 'Aucune arme.'));
}

function addArmeModal(main) {
  openModal('Ajouter une arme', [
    { name: 'nom', label: 'Nom *', full: true, placeholder: 'Nom de l\'arme' },
    { name: 'categorie', label: 'Catégorie', placeholder: 'feu / blanche / argent / gilet' },
    { name: 'prix_location', label: 'Prix location ($)', type: 'number', placeholder: '0' },
    { name: 'caution', label: 'Caution ($)', type: 'number', placeholder: '0' },
    { name: 'quantite', label: 'Quantité', type: 'int', placeholder: '1' },
    { name: 'description', label: 'Description', full: true, placeholder: 'Détails...' },
  ], async (data) => {
    data.nom = data.nom.trim();
    if (!data.nom) return;
    await create('Arme', data);
    await reload('Arme');
    viewArmes(main);
  });
}

function louerArmeModal(main, a) {
  const today = new Date().toISOString().slice(0, 10);
  openModal(`Louer — ${a.nom}`, [
    { name: 'locataire', label: 'Locataire *', full: true, placeholder: 'Nom du locataire' },
    { name: 'date_debut', label: 'Date début', value: today },
    { name: 'date_retour', label: 'Date retour', value: today },
    { name: 'caution', label: 'Caution ($)', type: 'number', value: a.caution || 0 },
  ], async (data) => {
    if (!data.locataire.trim()) return;
    await update('Arme', a.id, { statut: 'Loué', locataire: data.locataire, date_debut: data.date_debut, date_retour: data.date_retour, caution: data.caution });
    await create('LocationArme', { arme_nom: a.nom, arme_id: a.id, locataire: data.locataire, date_debut: data.date_debut, date_retour: data.date_retour, caution: data.caution || 0, prix_location: a.prix_location || 0, statut: 'En cours' });
    await reload('Arme');
    await reload('LocationArme');
    viewArmes(main);
  });
}

function rendreArmeModal(main, a) {
  openModal(`Rendre — ${a.nom}`, [
    { name: 'option', label: 'Encaissement', select: true, options: [
      { value: 'total', label: `Caution + location (${(a.caution || 0) + (a.prix_location || 0)} $)` },
      { value: 'caution', label: `Caution seule (${a.caution || 0} $)` },
      { value: 'location', label: `Location seule (${a.prix_location || 0} $)` },
      { value: 'none', label: 'Aucun encaissement' },
    ] },
  ], async (data) => {
    await update('Arme', a.id, { statut: 'Disponible', locataire: '', date_debut: '', date_retour: '' });
    if (data.option && data.option !== 'none') {
      let montant = 0, label = '';
      if (data.option === 'caution') { montant = a.caution || 0; label = `caution ${a.caution || 0}$`; }
      else if (data.option === 'location') { montant = a.prix_location || 0; label = `location ${a.prix_location || 0}$`; }
      else if (data.option === 'total') { montant = (a.caution || 0) + (a.prix_location || 0); label = `caution + location`; }
      await create('Movement', { type: 'depot', montant, note: `Retour arme : ${a.nom} (${a.locataire || ''}) — ${label}` });
    }
    await reload('Arme');
    await reload('Movement');
    viewArmes(main);
  });
}

// ---- Contrebande ----
let cbState = { q: '', type: 'Tous' };
async function viewContrebande(main) {
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, 'Contrebande'));
  main.append(el('div', { className: 'page-sub' }, `${cache.contrebande.length} article(s)`));
  const tb = el('div', { className: 'toolbar' });
  const s = el('div', { className: 'search' }, ['🔍 ', el('input', { placeholder: 'Rechercher...', value: cbState.q })]);
  s.querySelector('input').addEventListener('input', e => { cbState.q = e.target.value; viewContrebande(main); });
  tb.append(s);
  const pills = el('div', { className: 'pills' });
  ['Tous', 'Gaz Bz', 'Fausse plaque'].forEach(t => pills.append(el('button', { className: 'pill' + (cbState.type === t ? ' active' : ''), onClick: () => { cbState.type = t; viewContrebande(main); } }, t)));
  tb.append(pills);
  tb.append(el('button', { className: 'btn-add', onClick: () => addContrebandeModal(main) }, '+ Ajouter'));
  main.append(tb);
  const filtered = cache.contrebande.filter(o => {
    const mc = cbState.type === 'Tous' || o.type === cbState.type;
    const mq = !cbState.q || (o.nom || '').toLowerCase().includes(cbState.q.toLowerCase());
    return mc && mq;
  });
  const grid = cardGrid(filtered, c => el('div', { className: 'card' }, [
    el('button', { className: 'card-del', onClick: async () => { await remove('Contrebande', c.id); await reload('Contrebande'); viewContrebande(main); } }, '✕'),
    el('div', { className: 'card-cat' }, c.type || 'Gaz Bz'),
    el('div', { className: 'card-name' }, c.nom),
    el('div', { className: 'card-row' }, [el('div', { className: 'card-price' }, c.prix ? `${c.prix} $` : '—'), el('div', { className: 'card-qty' }, c.quantite ? `Qté: ${c.quantite}` : '')]),
    el('div', { className: 'card-actions' }, [el('button', { className: 'btn-sm sell', onClick: () => sellContrebandeModal(main, c) }, 'Vendre')]),
  ]));
  main.append(grid || emptyState('☣', 'Aucun article.'));
}

function addContrebandeModal(main) {
  openModal('Ajouter contrebande', [
    { name: 'nom', label: 'Nom *', full: true, placeholder: 'Nom de l\'article' },
    { name: 'type', label: 'Type', select: true, options: [{ value: 'Gaz Bz', label: 'Gaz Bz' }, { value: 'Fausse plaque', label: 'Fausse plaque' }] },
    { name: 'prix', label: 'Prix ($)', type: 'number', placeholder: '0' },
    { name: 'quantite', label: 'Quantité', type: 'int', placeholder: '0' },
    { name: 'description', label: 'Description', full: true, placeholder: 'Détails...' },
  ], async (data) => {
    data.nom = data.nom.trim();
    if (!data.nom) return;
    await create('Contrebande', data);
    await reload('Contrebande');
    viewContrebande(main);
  });
}

function sellContrebandeModal(main, c) {
  openModal(`Vendre — ${c.nom}`, [
    { name: 'quantite', label: 'Quantité à vendre', type: 'int', value: 1, placeholder: '1' },
    { name: 'prix', label: 'Prix unitaire ($)', type: 'number', value: c.prix || 0 },
  ], async (data) => {
    const qty = Math.max(1, parseInt(data.quantite) || 1);
    const newQte = Math.max(0, (c.quantite || 0) - qty);
    await update('Contrebande', c.id, { quantite: newQte, statut: newQte === 0 ? 'Vendu' : (c.statut || 'Disponible') });
    await create('Movement', { type: 'depot', montant: (parseFloat(data.prix) || 0) * qty, note: `Vente contrebande : ${c.nom} (x${qty})` });
    await reload('Contrebande');
    await reload('Movement');
    viewContrebande(main);
  });
}

// ---- Coffre ----
async function viewCoffre(main) {
  main.innerHTML = '';
  const depots = cache.movements.filter(m => m.type === 'depot').reduce((s, m) => s + (m.montant || 0), 0);
  const retraits = cache.movements.filter(m => m.type === 'retrait').reduce((s, m) => s + (m.montant || 0), 0);
  const balance = depots - retraits;
  main.append(el('div', { className: 'page-title' }, 'Coffre'));
  main.append(el('div', { className: 'page-sub' }, `${cache.movements.length} mouvement(s)`));
  const bal = el('div', { className: 'balance' }, [
    balCard('Solde', `${balance} $`, '#ff473a'),
    balCard('Dépôts', `${depots} $`, '#4ade80'),
    balCard('Retraits', `${retraits} $`, '#f87171'),
  ]);
  main.append(bal);
  main.append(el('button', { className: 'btn-add', style: { marginLeft: 0, marginBottom: '16px' }, onClick: () => addMovementModal(main) }, '+ Nouveau mouvement'));
  if (!cache.movements.length) { main.append(emptyState('$', 'Aucun mouvement.')); return; }
  const list = el('div', { className: 'mov-list' });
  cache.movements.forEach(m => {
    list.append(el('div', { className: 'mov' }, [
      el('span', { className: `mov-type ${m.type}` }, m.type === 'depot' ? 'Dépôt' : 'Retrait'),
      el('div', { className: 'mov-note' }, m.note || ''),
      el('div', { className: 'mov-amount', style: { color: m.type === 'depot' ? '#4ade80' : '#f87171' } }, `${m.type === 'depot' ? '+' : '-'}${m.montant || 0} $`),
      el('button', { className: 'card-del', style: { position: 'static', width: '26px', height: '26px' }, onClick: async () => { await remove('Movement', m.id); await reload('Movement'); viewCoffre(main); } }, '✕'),
    ]));
  });
  main.append(list);
}

function balCard(label, value, color) {
  return el('div', { className: 'bal-card' }, [el('div', { className: 'bal-label' }, label), el('div', { className: 'bal-value', style: { color } }, value)]);
}

function addMovementModal(main) {
  openModal('Nouveau mouvement', [
    { name: 'type', label: 'Type', select: true, options: [{ value: 'depot', label: 'Dépôt' }, { value: 'retrait', label: 'Retrait' }] },
    { name: 'montant', label: 'Montant ($)', type: 'number', placeholder: '0' },
    { name: 'note', label: 'Note', full: true, placeholder: 'Description' },
  ], async (data) => {
    if (!data.montant || !data.note.trim()) return;
    await create('Movement', { type: data.type, montant: data.montant, note: data.note });
    await reload('Movement');
    viewCoffre(main);
  });
}

// ---- Groupes ----
async function viewGroupes(main) {
  main.innerHTML = '';
  main.append(el('div', { className: 'page-title' }, 'Groupes'));
  main.append(el('div', { className: 'page-sub' }, `${cache.sources.length} groupe(s)`));
  main.append(el('button', { className: 'btn-add', style: { marginLeft: 0, marginBottom: '16px' }, onClick: () => addSourceModal(main) }, '+ Ajouter un groupe'));
  if (!cache.sources.length) { main.append(emptyState('≡', 'Aucun groupe.')); return; }
  const grid = el('div', { className: 'grid' });
  cache.sources.forEach(s => {
    const count = cache.objets.filter(o => o.vendeur === s.nom).length + cache.bijoux.filter(o => o.vendeur === s.nom).length;
    grid.append(el('div', { className: 'card' }, [
      el('button', { className: 'card-del', onClick: async () => { await remove('Source', s.id); cache.sources = cache.sources.filter(x => x.id !== s.id); viewGroupes(main); } }, '✕'),
      el('div', { className: 'card-name' }, s.nom),
      el('div', { className: 'card-qty', style: { marginTop: '8px' } }, `${count} transaction(s)`),
    ]));
  });
  main.append(grid);
}

function addSourceModal(main) {
  openModal('Ajouter un groupe', [
    { name: 'nom', label: 'Nom du groupe *', full: true, placeholder: 'Nom' },
  ], async (data) => {
    data.nom = data.nom.trim();
    if (!data.nom) return;
    await create('Source', { nom: data.nom });
    cache.sources = await list('Source');
    viewGroupes(main);
  });
}

// ---- Boot ----
window.addEventListener('message', (e) => {
  const data = e.data;
  if (!data || !data.type) return;
  if (data.type === 'open') {
    $('#overlay').classList.add('open');
    if (!user) bootLogin();
  } else if (data.type === 'close') {
    $('#overlay').classList.remove('open');
  }
});

$('#closeBtn').addEventListener('click', () => {
  $('#overlay').classList.remove('open');
  fetch(`https://${GetParentResourceName()}/close`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {});
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') $('#closeBtn').click();
});