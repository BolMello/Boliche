const STATUS_CLASSE = {
  'Planejado': 'planejado',
  'Em andamento': 'andamento',
  'Encerrado': 'encerrado',
};

// Remove acentos para a busca achar "Andre" em "André".
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// "2026-10-12" → "12/10/2026" (sem passar por Date, evitando erro de fuso horário).
export function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Card de campeonato usado na página de campeonatos e na tela inicial.
export function criarCardCampeonato(campeonato) {
  const card = document.createElement('article');
  card.className = 'champ';

  const topo = document.createElement('div');
  topo.className = 'champ__top';
  const status = document.createElement('span');
  status.className = `status-badge status-badge--${STATUS_CLASSE[campeonato.status] ?? 'planejado'}`;
  status.textContent = campeonato.status;
  topo.append(status);

  const titulo = document.createElement('h3');
  titulo.className = 'champ__title';
  titulo.textContent = campeonato.descricao;

  const meta = document.createElement('div');
  meta.className = 'champ__meta';
  meta.innerHTML = `
    <span><svg class="icon"><use href="#i-calendar"/></svg><span data-campo="inicio"></span></span>
    <span><svg class="icon"><use href="#i-trophy"/></svg><span data-campo="ano"></span></span>`;
  meta.querySelector('[data-campo="inicio"]').textContent = `Início ${formatarData(campeonato.data_inicio)}`;
  meta.querySelector('[data-campo="ano"]').textContent = `Ano ${campeonato.ano}`;

  card.append(topo, titulo, meta);
  return card;
}
