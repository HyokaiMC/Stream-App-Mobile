const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');
const dialog = document.getElementById('settings-dialog');
const hostInput = document.getElementById('host-input');
const tokenInput = document.getElementById('token-input');

function getSettings() {
  return {
    host: localStorage.getItem('sd-host') || '',
    token: localStorage.getItem('sd-token') || '',
  };
}

function saveSettings(host, token) {
  localStorage.setItem('sd-host', host);
  localStorage.setItem('sd-token', token);
}

function setStatus(text) {
  statusEl.textContent = text;
}

async function apiFetch(path, options = {}) {
  const { host, token } = getSettings();
  if (!host || !token) throw new Error('Configure d\'abord la connexion (icone reglages).');

  const res = await fetch(`http://${host}${path}`, {
    ...options,
    headers: {
      'X-Auth-Token': token,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `erreur HTTP ${res.status}`);
  }
  return res.json();
}

async function loadButtons() {
  setStatus('Chargement...');
  try {
    const buttons = await apiFetch('/buttons');
    renderButtons(buttons);
    setStatus(`Connecte - ${buttons.length} boutons`);
  } catch (err) {
    grid.innerHTML = '';
    setStatus(err.message);
  }
}

function renderButtons(buttons) {
  grid.innerHTML = '';
  buttons.forEach((btn) => {
    const el = document.createElement('button');
    el.className = 'deck-btn';
    el.textContent = btn.label;
    el.addEventListener('click', () => runButton(btn.id, el));
    grid.appendChild(el);
  });
}

async function runButton(id, el) {
  el.style.opacity = '0.5';
  try {
    await apiFetch(`/run/${id}`, { method: 'POST' });
    setStatus(`Execute: ${id}`);
  } catch (err) {
    setStatus(`Erreur: ${err.message}`);
  } finally {
    el.style.opacity = '1';
  }
}

document.getElementById('settings-btn').addEventListener('click', () => {
  const { host, token } = getSettings();
  hostInput.value = host;
  tokenInput.value = token;
  dialog.showModal();
});

document.getElementById('cancel-btn').addEventListener('click', () => dialog.close());

document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  saveSettings(hostInput.value.trim(), tokenInput.value.trim());
  dialog.close();
  loadButtons();
});

loadButtons();
