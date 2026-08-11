import React from 'react';
import { Download, FileCode, Folder } from 'lucide-react';

const FILES = [
  {
    path: 'fxmanifest.lua',
    folder: 'montoya/',
    content: `fx_version 'cerulean'
game 'gta5'

author 'Montoya'
description 'Ouvre le site Montoya en NUI'
version '1.0.0'

client_script 'client.lua'

ui_page 'html/index.html'

files {
  'html/index.html',
  'html/style.css',
  'html/app.js'
}
`
  },
  {
    path: 'client.lua',
    folder: 'montoya/',
    content: `local SITE_URL = 'https://comptamontoya.com'
local TOGGLE_KEY = 'F6'
local isOpen = false

CreateThread(function()
  SendNUIMessage({ type = 'init', url = SITE_URL })
end)

local function toggleNUI()
  isOpen = not isOpen
  SetNuiFocus(isOpen, isOpen)
  SendNUIMessage({ type = isOpen and 'open' or 'close' })
end

RegisterCommand('montoya', function() toggleNUI() end, false)
RegisterKeyMapping('montoya', 'Ouvrir le site Montoya', 'keyboard', TOGGLE_KEY)

RegisterNUICallback('close', function(_, cb)
  isOpen = false
  SetNuiFocus(false, false)
  cb({ ok = true })
end)
`
  },
  {
    path: 'index.html',
    folder: 'montoya/html/',
    content: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Montoya</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="overlay">
    <div id="topbar">
      <span id="title">MONTOYA</span>
      <button id="closeBtn">Fermer ✕</button>
    </div>
    <iframe id="frame" src="" allow="clipboard-read; clipboard-write"></iframe>
  </div>
  <script src="app.js"></script>
</body>
</html>
`
  },
  {
    path: 'style.css',
    folder: 'montoya/html/',
    content: `* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

#overlay {
  position: fixed;
  inset: 0;
  display: none;
  flex-direction: column;
  background: rgba(10, 10, 12, 0.92);
  backdrop-filter: blur(6px);
}

#overlay.open { display: flex; }

#topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background: #121212;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

#title { color: #fff; font-weight: 700; letter-spacing: 2px; font-size: 14px; }

#closeBtn {
  background: #ff473a;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
#closeBtn:hover { background: #ff6a5e; }

#frame { flex: 1; width: 100%; border: none; background: #fff; }
`
  },
  {
    path: 'app.js',
    folder: 'montoya/html/',
    content: `const overlay = document.getElementById('overlay');
const frame = document.getElementById('frame');
const closeBtn = document.getElementById('closeBtn');
let url = '';

window.addEventListener('message', (e) => {
  const data = e.data;
  if (!data || !data.type) return;
  if (data.type === 'init') { url = data.url; frame.src = url; }
  else if (data.type === 'open') { if (url) frame.src = url; overlay.classList.add('open'); }
  else if (data.type === 'close') { overlay.classList.remove('open'); frame.src = 'about:blank'; }
});

closeBtn.addEventListener('click', () => {
  fetch(\`https://\${GetParentResourceName()}/close\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({})
  }).catch(() => {});
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeBtn.click();
});
`
  }
];

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function FivemResource() {
  const downloadAll = () => {
    FILES.forEach((f, i) => setTimeout(() => downloadFile(f.path, f.content), i * 300));
  };

  return (
    <div className="min-h-screen" style={{ background: '#121212' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #ff5722, #ff7a4d)' }}>M</div>
          <div>
            <h1 className="text-[24px] font-bold text-white tracking-tight">Ressource FiveM</h1>
            <p className="text-[13px]" style={{ color: '#808080' }}>Télécharge les fichiers et copie-les sur ton serveur</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 mt-6 mb-6"
          style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-start gap-3">
            <Folder size={18} style={{ color: '#ff5722' }} className="mt-0.5 shrink-0" />
            <div className="text-[12.5px] leading-relaxed" style={{ color: '#aaa' }}>
              <div className="text-white font-semibold mb-1">Structure attendue</div>
              <code className="block text-[11.5px]" style={{ color: '#808080' }}>
                resources/montoya/fxmanifest.lua<br />
                resources/montoya/client.lua<br />
                resources/montoya/html/index.html<br />
                resources/montoya/html/style.css<br />
                resources/montoya/html/app.js
              </code>
              <div className="mt-2">Puis ajoute <code style={{ color: '#ff7a4d' }}>ensure montoya</code> dans ton <code>server.cfg</code></div>
            </div>
          </div>
        </div>

        <button onClick={downloadAll}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold text-white mb-4"
          style={{ background: '#ff5722' }}>
          <Download size={18} /> Tout télécharger
        </button>

        <div className="space-y-3">
          {FILES.map(f => (
            <div key={f.path} className="flex items-center justify-between rounded-xl p-4"
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <FileCode size={18} style={{ color: '#808080' }} className="shrink-0" />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-white truncate">{f.path}</div>
                  <div className="text-[11px]" style={{ color: '#666' }}>{f.folder}{f.path}</div>
                </div>
              </div>
              <button onClick={() => downloadFile(f.path, f.content)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-medium text-white shrink-0"
                style={{ background: '#ff5722' }}>
                <Download size={14} /> Télécharger
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-[11.5px] text-center" style={{ color: '#666' }}>
          En jeu, appuie sur <span style={{ color: '#ff7a4d' }}>F6</span> pour ouvrir/fermer le site
        </div>
      </div>
    </div>
  );
}