const { shell } = require('electron');

const STORE_NAMES = {
  '1': 'Steam',
  '2': 'GamersGate',
  '3': 'GreenManGaming',
  '7': 'GOG',
  '8': 'Origin',
  '11': 'Humble Store',
  '13': 'Uplay',
  '15': 'Fanatical',
  '21': 'WinGameStore',
  '23': 'GameBillet',
  '25': 'Epic Games Store',
  '27': 'Gamesplanet',
  '29': 'Voidu',
  '30': 'IndieGala',
  '31': 'Battle.net'
};

function storeLabel(storeID) {
  return STORE_NAMES[String(storeID)] || `Store ${storeID || '?'}`;
}

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const topDealsBtn = document.getElementById('topDealsBtn');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

function setStatus(message) {
  statusEl.textContent = message || '';
}

async function fetchDealsByTitle(title) {
  const url = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=20`;
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
  resultsEl.innerHTML = '<p class="empty">Cargando…</p>';
  setStatus(`Buscando “${title}”…`);
  try {
    const deals = await fetchDealsByTitle(title);
    setStatus(deals.length ? `${deals.length} ofertas encontradas` : 'Sin resultados');
    renderDeals(deals);
  } catch (err) {
    setStatus(err.message || 'Error al buscar');
    resultsEl.innerHTML = `<p class="empty error">${err.message || 'Error al buscar'}</p>`;
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
        <p class="prices">
          <span class="sale"></span>
          <span class="normal"></span>
        </p>
        <p class="discount"></p>
        <p class="store"></p>
      </div>
    `;
    const img = card.querySelector('.thumb');
    if (deal.thumb) {
      img.src = deal.thumb;
    } else {
      img.remove();
    }
    img.alt = deal.title || 'Juego';
    card.querySelector('.deal-title').textContent = deal.title || 'Sin título';
    const sale = Number(deal.salePrice);
    const normal = Number(deal.normalPrice);
    const savings = Math.round(Number(deal.savings) || 0);
    card.querySelector('.sale').textContent = `$${sale.toFixed(2)}`;
    card.querySelector('.normal').textContent = `$${normal.toFixed(2)}`;
    if (savings > 0) {
      card.querySelector('.sale').classList.add('on-sale');
      card.querySelector('.discount').textContent = `-${savings}%`;
    } else {
      card.querySelector('.discount').textContent = 'Sin descuento';
    }
    card.querySelector('.store').textContent = storeLabel(deal.storeID);
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'open-deal';
    openBtn.textContent = 'Abrir oferta';
    openBtn.addEventListener('click', () => {
      const dealUrl = `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(deal.dealID)}`;
      shell.openExternal(dealUrl);
    });
    card.querySelector('.deal-body').appendChild(openBtn);
    fragment.appendChild(card);
  });
  resultsEl.appendChild(fragment);
}

async function fetchTopDeals() {
  const url = 'https://www.cheapshark.com/api/1.0/deals?sortBy=Savings&pageSize=10';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`CheapShark ${response.status}`);
  return response.json();
}

async function runTopDeals() {
  searchBtn.disabled = true;
  topDealsBtn.disabled = true;
  resultsEl.innerHTML = '<p class="empty">Cargando…</p>';
  setStatus('Cargando chollos top…');
  try {
    const deals = await fetchTopDeals();
    setStatus(`${deals.length} chollos destacados`);
    renderDeals(deals);
  } catch (err) {
    setStatus(err.message || 'Error al cargar chollos');
    resultsEl.innerHTML = `<p class="empty error">${err.message || 'Error al cargar chollos'}</p>`;
  } finally {
    searchBtn.disabled = false;
    topDealsBtn.disabled = false;
  }
}

topDealsBtn.addEventListener('click', runTopDeals);

window.addEventListener('DOMContentLoaded', () => {
  searchInput.focus();
});
