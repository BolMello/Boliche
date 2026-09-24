import { supabase } from './supabase.js';
import { renderLayout, onAuthChange, openLogin, setupDialog, showFormError } from './layout.js';

renderLayout('jogadores');

const state = {
  jogadores: [],
  filtro: 'todos',
  busca: '',
  user: null,
  editandoId: null,
  carregado: false,
};

const el = {
  players: document.getElementById('players'),
  message: document.getElementById('list-message'),
  busca: document.getElementById('busca'),
  filtros: document.querySelectorAll('[data-filtro]'),
  btnNovo: document.getElementById('btn-novo'),
  dialog: document.getElementById('jogador-dialog'),
  dialogTitle: document.getElementById('jogador-title'),
  form: document.getElementById('jogador-form'),
  countTotal: document.getElementById('count-total'),
  countM: document.getElementById('count-m'),
  countF: document.getElementById('count-f'),
};

// Remove acentos para a busca achar "Andre" em "André".
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function showMessage(text, kind = 'info') {
  el.message.textContent = text;
  el.message.dataset.kind = kind;
  el.message.hidden = false;
}

async function carregar() {
  const { data, error } = await supabase.from('jogador').select('id, nome, sexo');
  if (error) {
    el.players.replaceChildren();
    showMessage(`Erro ao carregar jogadores: ${error.message}`, 'error');
    return;
  }
  state.jogadores = data.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  state.carregado = true;
  render();
}

function render() {
  if (!state.carregado) return;

  const total = state.jogadores.length;
  const masculino = state.jogadores.filter((j) => j.sexo === 'Masculino').length;
  el.countTotal.textContent = total;
  el.countM.textContent = masculino;
  el.countF.textContent = total - masculino;

  const busca = normalizar(state.busca.trim());
  const lista = state.jogadores.filter((j) =>
    (state.filtro === 'todos' || j.sexo === state.filtro) && normalizar(j.nome).includes(busca));

  el.players.replaceChildren(...lista.map(criarCard));

  if (total === 0) showMessage('Nenhum jogador cadastrado ainda.');
  else if (lista.length === 0) showMessage('Nenhum jogador encontrado.');
  else el.message.hidden = true;
}

function criarCard(jogador) {
  const card = document.createElement('article');
  card.className = 'player';

  const badge = document.createElement('span');
  const masculino = jogador.sexo === 'Masculino';
  badge.className = `player__badge player__badge--${masculino ? 'm' : 'f'}`;
  badge.textContent = masculino ? 'M' : 'F';
  badge.title = jogador.sexo;

  const nome = document.createElement('span');
  nome.className = 'player__name';
  nome.textContent = jogador.nome;
  nome.title = jogador.nome;

  card.append(badge, nome);

  if (state.user) {
    const acoes = document.createElement('div');
    acoes.className = 'player__actions';
    acoes.innerHTML = `
      <button type="button" class="icon-btn" data-acao="editar" aria-label="Editar"><svg class="icon"><use href="#i-pencil"/></svg></button>
      <button type="button" class="icon-btn icon-btn--danger" data-acao="excluir" aria-label="Excluir"><svg class="icon"><use href="#i-trash"/></svg></button>`;
    acoes.querySelector('[data-acao="editar"]').addEventListener('click', () => abrirForm(jogador));
    acoes.querySelector('[data-acao="excluir"]').addEventListener('click', () => excluir(jogador));
    card.append(acoes);
  }

  return card;
}

function abrirForm(jogador = null) {
  if (!state.user) {
    openLogin();
    return;
  }
  state.editandoId = jogador?.id ?? null;
  el.dialogTitle.textContent = jogador ? 'Editar jogador' : 'Novo jogador';
  el.dialog.showModal();
  if (jogador) {
    el.form.nome.value = jogador.nome;
    el.form.querySelector(`input[name="sexo"][value="${jogador.sexo}"]`).checked = true;
  }
  el.form.nome.focus();
}

async function salvar(event) {
  event.preventDefault();
  const registro = {
    nome: el.form.nome.value.trim().replace(/\s+/g, ' '),
    sexo: el.form.sexo.value,
  };
  if (!registro.nome) return showFormError(el.form, 'Informe o nome do jogador.');
  if (!registro.sexo) return showFormError(el.form, 'Selecione o sexo.');

  const submit = el.form.querySelector('[type="submit"]');
  submit.disabled = true;
  const { error } = state.editandoId
    ? await supabase.from('jogador').update(registro).eq('id', state.editandoId)
    : await supabase.from('jogador').insert(registro);
  submit.disabled = false;

  if (error) return showFormError(el.form, `Não foi possível salvar: ${error.message}`);

  el.dialog.close();
  await carregar();
}

async function excluir(jogador) {
  if (!confirm(`Excluir o jogador "${jogador.nome}"?`)) return;
  const { error } = await supabase.from('jogador').delete().eq('id', jogador.id);
  if (error) {
    alert(`Não foi possível excluir: ${error.message}`);
    return;
  }
  await carregar();
}

setupDialog(el.dialog);
el.form.addEventListener('submit', salvar);
el.btnNovo.addEventListener('click', () => abrirForm());

el.busca.addEventListener('input', () => {
  state.busca = el.busca.value;
  render();
});

el.filtros.forEach((botao) => {
  botao.addEventListener('click', () => {
    state.filtro = botao.dataset.filtro;
    el.filtros.forEach((b) => {
      const ativo = b === botao;
      b.classList.toggle('is-active', ativo);
      b.setAttribute('aria-pressed', ativo);
    });
    render();
  });
});

// Mostra ou esconde editar/excluir conforme o login.
onAuthChange((user) => {
  state.user = user;
  render();
});

carregar();
