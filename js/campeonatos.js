import { supabase } from './supabase.js';
import { renderLayout, setupDialog, showFormError } from './layout.js';
import { normalizar, criarCardCampeonato } from './util.js';

const user = await renderLayout('campeonatos');

const state = {
  campeonatos: [],
  filtro: 'todos',
  busca: '',
  editandoId: null,
  carregado: false,
};

const el = {
  champs: document.getElementById('champs'),
  message: document.getElementById('list-message'),
  busca: document.getElementById('busca'),
  filtros: document.querySelectorAll('[data-filtro]'),
  btnNovo: document.getElementById('btn-novo'),
  dialog: document.getElementById('campeonato-dialog'),
  dialogTitle: document.getElementById('campeonato-title'),
  form: document.getElementById('campeonato-form'),
  countTotal: document.getElementById('count-total'),
  countPlanejado: document.getElementById('count-planejado'),
  countAndamento: document.getElementById('count-andamento'),
  countEncerrado: document.getElementById('count-encerrado'),
};

function showMessage(text, kind = 'info') {
  el.message.textContent = text;
  el.message.dataset.kind = kind;
  el.message.hidden = false;
}

async function carregar() {
  const { data, error } = await supabase
    .from('campeonato')
    .select('id, descricao, ano, data_inicio, status')
    .order('data_inicio', { ascending: false })
    .order('descricao');
  if (error) {
    el.champs.replaceChildren();
    showMessage(`Erro ao carregar campeonatos: ${error.message}`, 'error');
    return;
  }
  state.campeonatos = data;
  state.carregado = true;
  render();
}

function render() {
  if (!state.carregado) return;

  const contar = (status) => state.campeonatos.filter((c) => c.status === status).length;
  el.countTotal.textContent = state.campeonatos.length;
  el.countPlanejado.textContent = contar('Planejado');
  el.countAndamento.textContent = contar('Em andamento');
  el.countEncerrado.textContent = contar('Encerrado');

  const busca = normalizar(state.busca.trim());
  const lista = state.campeonatos.filter((c) =>
    (state.filtro === 'todos' || c.status === state.filtro)
    && (normalizar(c.descricao).includes(busca) || String(c.ano).includes(busca)));

  el.champs.replaceChildren(...lista.map(criarCard));

  if (state.campeonatos.length === 0) showMessage('Nenhum campeonato cadastrado ainda.');
  else if (lista.length === 0) showMessage('Nenhum campeonato encontrado.');
  else el.message.hidden = true;
}

function criarCard(campeonato) {
  const card = criarCardCampeonato(campeonato);

  const acoes = document.createElement('div');
  acoes.className = 'player__actions';
  acoes.innerHTML = `
    <button type="button" class="icon-btn" data-acao="editar" aria-label="Editar"><svg class="icon"><use href="#i-pencil"/></svg></button>
    <button type="button" class="icon-btn icon-btn--danger" data-acao="excluir" aria-label="Excluir"><svg class="icon"><use href="#i-trash"/></svg></button>`;
  acoes.querySelector('[data-acao="editar"]').addEventListener('click', () => abrirForm(campeonato));
  acoes.querySelector('[data-acao="excluir"]').addEventListener('click', () => excluir(campeonato));

  card.querySelector('.champ__top').append(acoes);
  return card;
}

function abrirForm(campeonato = null) {
  state.editandoId = campeonato?.id ?? null;
  el.dialogTitle.textContent = campeonato ? 'Editar campeonato' : 'Novo campeonato';
  el.dialog.showModal();

  const form = el.form;
  if (campeonato) {
    form.descricao.value = campeonato.descricao;
    form.ano.value = campeonato.ano;
    form.data_inicio.value = campeonato.data_inicio;
  } else {
    form.ano.value = new Date().getFullYear();
  }
  const status = campeonato?.status ?? 'Planejado';
  form.querySelector(`input[name="status"][value="${status}"]`).checked = true;
  form.descricao.focus();
}

async function salvar(event) {
  event.preventDefault();
  const form = el.form;
  const registro = {
    descricao: form.descricao.value.trim().replace(/\s+/g, ' '),
    ano: Number(form.ano.value),
    data_inicio: form.data_inicio.value,
    status: form.status.value,
  };
  if (!registro.descricao) return showFormError(form, 'Informe a descrição do campeonato.');
  if (!Number.isInteger(registro.ano) || registro.ano < 2000 || registro.ano > 2100) {
    return showFormError(form, 'Informe um ano entre 2000 e 2100.');
  }
  if (!registro.data_inicio) return showFormError(form, 'Informe a data de início.');
  if (!registro.status) return showFormError(form, 'Selecione o status.');

  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  const { error } = state.editandoId
    ? await supabase.from('campeonato').update(registro).eq('id', state.editandoId)
    : await supabase.from('campeonato').insert(registro);
  submit.disabled = false;

  if (error) return showFormError(form, `Não foi possível salvar: ${error.message}`);

  el.dialog.close();
  await carregar();
}

async function excluir(campeonato) {
  if (!confirm(`Excluir o campeonato "${campeonato.descricao}"?`)) return;
  const { error } = await supabase.from('campeonato').delete().eq('id', campeonato.id);
  if (error) {
    alert(`Não foi possível excluir: ${error.message}`);
    return;
  }
  await carregar();
}

async function iniciar() {
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

  await carregar();

  // "Criar primeiro" na tela inicial abre esta página com ?novo=1.
  if (new URLSearchParams(location.search).has('novo')) {
    history.replaceState(null, '', location.pathname);
    abrirForm();
  }
}

// Sem login, renderLayout já redirecionou para login.html.
if (user) iniciar();
