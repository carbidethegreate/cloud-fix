let token = '';
let accountId = '';
const API_BASE = 'https://cors.isomorphic-git.org/https://api.cloudflare.com/client/v4';
const statusEl = document.getElementById('status');
const connectBtn = document.getElementById('connect');
const tokenInput = document.getElementById('token');
const workersList = document.getElementById('workers-list');
const pagesList = document.getElementById('pages-list');
const generateBtn = document.getElementById('generate');
const fullReportBtn = document.getElementById('full-report');
const reportEl = document.getElementById('report');
const searchInput = document.getElementById('search');
const workersSelectAll = document.getElementById('workers-select-all');
const pagesSelectAll = document.getElementById('pages-select-all');

let workers = [];
let pages = [];
let selectedWorkers = new Set();
let selectedPages = new Set();

async function connect() {
  token = tokenInput.value.trim();
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/accounts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to connect');
    const accs = data.result;
    if (!accs || accs.length === 0) throw new Error('No accounts found');
    accountId = accs[0].id;
    statusEl.textContent = 'Connected';
    statusEl.classList.remove('not-connected');
    statusEl.classList.add('connected');
    await Promise.all([loadWorkers(), loadPages()]);
    fullReportBtn.disabled = false;
  } catch (err) {
    alert(err.message);
    statusEl.textContent = 'Not connected';
    statusEl.classList.remove('connected');
    statusEl.classList.add('not-connected');
  }
}

async function cfFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.message || res.statusText);
  return data.result;
}

async function loadWorkers() {
  try {
    workers = await cfFetch(`/accounts/${accountId}/workers/scripts`);
    renderList(workersList, workers, selectedWorkers, 'name');
  } catch (e) {
    console.error('workers', e);
  }
}

async function loadPages() {
  try {
    pages = await cfFetch(`/accounts/${accountId}/pages/projects`);
    renderList(pagesList, pages, selectedPages, 'name');
  } catch (e) {
    console.error('pages', e);
  }
}

function renderList(container, items, selectedSet, key) {
  container.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = item[key];
    cb.addEventListener('change', () => {
      if (cb.checked) selectedSet.add(cb.value); else selectedSet.delete(cb.value);
      updateGenerateState();
    });
    label.appendChild(cb);
    label.append(' ', item[key]);
    li.appendChild(label);
    container.appendChild(li);
  });
}

function updateGenerateState() {
  generateBtn.disabled = !(token && (selectedWorkers.size > 0 || selectedPages.size > 0));
}

generateBtn.addEventListener('click', async () => {
  reportEl.textContent = 'Loading...';
  const workerDetails = [];
  const pageDetails = [];
  for (const name of selectedWorkers) {
    try {
      const detail = await cfFetch(`/accounts/${accountId}/workers/scripts/${name}`);
      workerDetails.push(detail);
    } catch (e) {
      workerDetails.push({ name, error: e.message });
    }
  }
  for (const name of selectedPages) {
    try {
      const detail = await cfFetch(`/accounts/${accountId}/pages/projects/${name}`);
      pageDetails.push(detail);
    } catch (e) {
      pageDetails.push({ name, error: e.message });
    }
  }
  const report = { generatedAt: new Date().toISOString(), workers: workerDetails, pages: pageDetails };
  reportEl.innerHTML = '<pre>' + JSON.stringify(report, null, 2) + '</pre>';
});

fullReportBtn.addEventListener('click', async () => {
  if (!accountId) return;
  reportEl.textContent = 'Verifying token...';
  try {
    const result = await cfFetch(`/accounts/${accountId}/tokens/verify`);
    reportEl.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
  } catch (e) {
    reportEl.textContent = e.message;
  }
});

connectBtn.addEventListener('click', connect);

tokenInput.addEventListener('input', updateGenerateState);

workersSelectAll.addEventListener('change', () => {
  workersList.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.checked = workersSelectAll.checked;
    cb.dispatchEvent(new Event('change'));
  });
});

pagesSelectAll.addEventListener('change', () => {
  pagesList.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.checked = pagesSelectAll.checked;
    cb.dispatchEvent(new Event('change'));
  });
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  filterList(workersList, q);
  filterList(pagesList, q);
});

function filterList(container, q) {
  container.querySelectorAll('li').forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
