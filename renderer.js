const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const topDealsBtn = document.getElementById('topDealsBtn');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

function setStatus(message) {
  statusEl.textContent = message || '';
}

searchBtn.addEventListener('click', () => {
  const title = searchInput.value.trim();
  if (!title) {
    setStatus('Escribe el título de un juego');
    return;
  }
  setStatus(`Buscando “${title}”…`);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') searchBtn.click();
});
