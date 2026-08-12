-- =========================================================
--  Montoya — NUI (app autonome intégrée)
-- =========================================================

local TOGGLE_KEY = 'F6' -- Touche pour ouvrir/fermer (voir https://docs.fivem.net/docs/game-references/controls/)
local isOpen = false

-- Ouvre / ferme la NUI
local function toggleNUI()
  isOpen = not isOpen
  SetNuiFocus(isOpen, isOpen) -- (hasFocus, hasCursor)
  SendNUIMessage({
    type = isOpen and 'open' or 'close'
  })
  if not isOpen then
    -- s'assure que le focus est retiré
    SetNuiFocus(false, false)
  end
end

-- Touche d'ouverture
RegisterCommand('montoya', function()
  toggleNUI()
end, false)
RegisterKeyMapping('montoya', 'Ouvrir le panel Montoya', 'keyboard', TOGGLE_KEY)

-- Callback depuis la NUI (bouton fermer / ESC)
RegisterNUICallback('close', function(_, cb)
  isOpen = false
  SetNuiFocus(false, false)
  cb({ ok = true })
end)