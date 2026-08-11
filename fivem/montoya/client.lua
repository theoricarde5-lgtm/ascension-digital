-- =========================================================
--  Montoya — NUI
--  Remplace SITE_URL par l'URL publique de ton site publié
-- =========================================================

local SITE_URL = 'https://TON-SITE.base44.app' -- ⚠️ À REMPLACER
local TOGGLE_KEY = 'F6' -- Touche pour ouvrir/fermer (voir https://docs.fivem.net/docs/game-references/controls/)
local isOpen = false

-- Crée la NUI une fois au démarrage
CreateThread(function()
  SendNUIMessage({
    type = 'init',
    url = SITE_URL
  })
end)

-- Ouvre / ferme la NUI
local function toggleNUI()
  isOpen = not isOpen
  SetNuiFocus(isOpen, isOpen) -- (hasFocus, hasCursor)
  SendNUIMessage({
    type = isOpen and 'open' or 'close'
  })
end)

-- Touche d'ouverture
RegisterCommand('montoya', function()
  toggleNUI()
end, false)
RegisterKeyMapping('montoya', 'Ouvrir le site Montoya', 'keyboard', TOGGLE_KEY)

-- Callback depuis la NUI (bouton fermer / ESC)
RegisterNUICallback('close', function(_, cb)
  isOpen = false
  SetNuiFocus(false, false)
  cb({ ok = true })
end)