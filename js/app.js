import { supabase } from './supabase.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const statusEl = document.getElementById('db-status');

function setStatus(message, state) {
  statusEl.textContent = message;
  statusEl.className = `status status--${state}`;
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

    setStatus('✅ Conectado ao Supabase', 'ok');
  } catch (err) {
    console.error('Falha ao conectar ao Supabase:', err);
    setStatus(`❌ Falha ao conectar ao Supabase: ${err.message}`, 'error');
  }
}

checkConnection();
