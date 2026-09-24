import { supabase } from './supabase.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { renderLayout } from './layout.js';
import { criarCardCampeonato } from './util.js';

const user = await renderLayout('home');

const statusEl = document.getElementById('db-status');

function setStatus(message, state) {
  statusEl.textContent = message;
  statusEl.dataset.state = state;
}

// Testa a conexão sem depender de nenhuma tabela:
// o endpoint de health do Auth valida URL e chave do projeto.
async function checkConnection() {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const { error } = await supabase.auth.getSession();
    if (error) throw error;

    setStatus('Conectado ao Supabase', 'ok');
  } catch (err) {
    console.error('Falha ao conectar ao Supabase:', err);
    setStatus(`Falha ao conectar ao Supabase: ${err.message}`, 'error');
  }
}

async function contar(tabela, filtrar = (q) => q) {
  const { count, error } = await filtrar(supabase.from(tabela).select('*', { count: 'exact', head: true }));
  return error ? null : count;
}

async function carregarTotais() {
  const [campeonatos, ativos, jogadores] = await Promise.all([
    contar('campeonato'),
    contar('campeonato', (q) => q.eq('status', 'Em andamento')),
    contar('jogador'),
  ]);
  const mostrar = (id, valor) => {
    if (valor !== null) document.getElementById(id).textContent = valor;
  };
  mostrar('stat-campeonatos', campeonatos);
  mostrar('stat-ativos', ativos);
  mostrar('stat-jogadores', jogadores);
}

async function carregarRecentes() {
  const { data, error } = await supabase
    .from('campeonato')
    .select('id, descricao, ano, data_inicio, status')
    .order('data_inicio', { ascending: false })
    .limit(3);

  const lista = document.getElementById('recent-list');
  const vazio = document.getElementById('recent-empty');
  if (!error && data.length) {
    lista.replaceChildren(...data.map(criarCardCampeonato));
    lista.hidden = false;
  } else {
    vazio.hidden = false;
  }
}

if (user) {
  checkConnection();
  carregarTotais();
  carregarRecentes();
}
