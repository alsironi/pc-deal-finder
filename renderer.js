const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const topDealsBtn = document.getElementById('topDealsBtn');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

function setStatus(message) {
  statusEl.textContent = message || '';
}

async function fetchDealsByTitle(title) {
  const url = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`CheapShark ${response.status}`);
  return response.json();
}

async function runSearch() {
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
    renderDeals(deals);
  } catch (err) {
    setStatus(err.message || 'Error al buscar');
  } finally {
    searchBtn.disabled = false;
    topDealsBtn.disabled = false;
  }
}

searchBtn.addEventListener('click', runSearch);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runSearch();
});

function renderDeals(deals) {
  resultsEl.innerHTML = '';
  if (!deals || !deals.length) {
    resultsEl.innerHTML = '<p class="empty">No hay ofertas para mostrar.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  deals.forEach((deal) => {
    const card = document.createElement('article');
    card.className = 'deal-card';
    card.innerHTML = `
      <img class="thumb" alt="" loading="lazy" />
      <div class="deal-body">
        <h2 class="deal-title"></h2>
      </div>
    `;
    const img = card.querySelector('.thumb');
    img.src = deal.thumb || '';
    img.alt = deal.title || 'Juego';
    card.querySelector('.deal-title').textContent = deal.title || 'Sin título';
    fragment.appendChild(card);
  });
  resultsEl.appendChild(fragment);
}
