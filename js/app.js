import { supabase } from './supabase.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { renderLayout } from './layout.js';

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

async function carregarTotais() {
  const { count, error } = await supabase.from('jogador').select('*', { count: 'exact', head: true });
  if (!error) document.getElementById('stat-jogadores').textContent = count ?? 0;
}

if (user) {
  checkConnection();
  carregarTotais();
}
