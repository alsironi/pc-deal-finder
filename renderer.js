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

async function fetchDealsByTitle(title) {
  const url = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`CheapShark ${response.status}`);
  return response.json();
}

searchBtn.addEventListener('click', async () => {
  const title = searchInput.value.trim();
  if (!title) {
    setStatus('Escribe el título de un juego');
    return;
  }
  searchBtn.disabled = true;
  topDealsBtn.disabled = true;
  setStatus(`Buscando “${title}”…`);
  try {
    const deals = await fetchDealsByTitle(title);
    setStatus(deals.length ? `${deals.length} ofertas encontradas` : 'Sin resultados');
    window.__lastDeals = deals;
  } catch (err) {
    setStatus(err.message || 'Error al buscar');
  } finally {
    searchBtn.disabled = false;
    topDealsBtn.disabled = false;
  }
});
