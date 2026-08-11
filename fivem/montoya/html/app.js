const overlay = document.getElementById('overlay');
const frame = document.getElementById('frame');
const closeBtn = document.getElementById('closeBtn');

let url = '';

window.addEventListener('message', (e) => {
  const data = e.data;
  if (!data || !data.type) return;

  if (data.type === 'init') {
    url = data.url;
    frame.src = url;
  } else if (data.type === 'open') {
    if (url) frame.src = url;
    overlay.classList.add('open');
  } else if (data.type === 'close') {
    overlay.classList.remove('open');
    frame.src = 'about:blank';
  }
});

closeBtn.addEventListener('click', () => {
  fetch(`https://${GetParentResourceName()}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({})
  }).catch(() => {});
});

// ESC pour fermer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeBtn.click();
});