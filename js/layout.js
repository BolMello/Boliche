import { supabase } from './supabase.js';

// Ícones (Lucide) usados em todas as páginas via <use href="#i-nome">.
const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="i-zap" viewBox="0 0 24 24"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></symbol>
  <symbol id="i-trophy" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
  <symbol id="i-layers" viewBox="0 0 24 24"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></symbol>
  <symbol id="i-user-plus" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>
  <symbol id="i-medal" viewBox="0 0 24 24"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></symbol>
  <symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></symbol>
  <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></symbol>
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></symbol>
  <symbol id="i-pencil" viewBox="0 0 24 24"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></symbol>
  <symbol id="i-trash" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>
  <symbol id="i-log-in" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></symbol>
  <symbol id="i-log-out" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></symbol>
</svg>`;

const NAV = [
  { id: 'campeonatos', label: 'Campeonatos', href: '#', icon: 'trophy' },
  { id: 'jogadores', label: 'Jogadores', href: 'jogadores.html', icon: 'users' },
  { id: 'quarteto', label: 'Quarteto', href: '#', icon: 'layers' },
  { id: 'dupla', label: 'Dupla', href: '#', icon: 'user-plus' },
  { id: 'individual', label: 'Individual', href: '#', icon: 'user' },
  { id: 'ranking', label: 'Ranking', href: '#', icon: 'medal' },
];

const LOGIN_DIALOG = `
<dialog class="modal" id="login-dialog" aria-labelledby="login-title">
  <form class="modal__form" id="login-form">
    <div class="modal__head">
      <h2 class="modal__title" id="login-title">Entrar</h2>
      <button type="button" class="icon-btn" data-close aria-label="Fechar"><svg class="icon"><use href="#i-x"/></svg></button>
    </div>
    <label class="field"><span>E-mail</span><input type="email" name="email" required autocomplete="username" /></label>
    <label class="field"><span>Senha</span><input type="password" name="password" required autocomplete="current-password" /></label>
    <p class="form-error" hidden></p>
    <div class="modal__actions">
      <button type="button" class="btn btn--ghost" data-close>Cancelar</button>
      <button type="submit" class="btn btn--primary"><svg class="icon"><use href="#i-log-in"/></svg>Entrar</button>
    </div>
  </form>
</dialog>`;

let currentUser = null;
let loginDialog = null;
const listeners = new Set();

// Registra uma função chamada sempre que o usuário logado mudar.
export function onAuthChange(fn) {
  listeners.add(fn);
  fn(currentUser);
}

export function openLogin() {
  loginDialog.showModal();
}

// Fecha o popup pelos botões [data-close] ou clicando fora dele,
// e limpa o formulário e as mensagens de erro ao fechar.
export function setupDialog(dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.querySelector('form')?.reset();
    dialog.querySelectorAll('.form-error').forEach((p) => {
      p.hidden = true;
      p.textContent = '';
    });
  });
}

export function showFormError(form, message) {
  const p = form.querySelector('.form-error');
  p.textContent = message;
  p.hidden = false;
}

function renderAuth() {
  const area = document.getElementById('auth-area');
  if (currentUser) {
    area.innerHTML = `
      <span class="auth__email"></span>
      <button type="button" class="btn btn--ghost btn--sm"><svg class="icon"><use href="#i-log-out"/></svg>Sair</button>`;
    area.querySelector('.auth__email').textContent = currentUser.email;
    area.querySelector('button').addEventListener('click', () => supabase.auth.signOut());
  } else {
    area.innerHTML = `
      <button type="button" class="btn btn--ghost btn--sm"><svg class="icon"><use href="#i-log-in"/></svg>Entrar</button>`;
    area.querySelector('button').addEventListener('click', openLogin);
  }
}

export function renderLayout(active) {
  const nav = NAV.map((item) => {
    const current = item.id === active ? ' class="is-active" aria-current="page"' : '';
    return `<a href="${item.href}"${current}><svg class="icon"><use href="#i-${item.icon}"/></svg>${item.label}</a>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `${SPRITE}
    <header class="topbar">
      <div class="container topbar__inner">
        <a href="index.html" class="brand">
          <span class="brand__logo"><svg class="icon"><use href="#i-zap"/></svg></span>
          <span class="brand__name">Boliche PMFC</span>
        </a>
        <nav class="nav" aria-label="Principal">${nav}</nav>
        <div class="auth" id="auth-area"></div>
      </div>
    </header>`);
  document.body.insertAdjacentHTML('beforeend', LOGIN_DIALOG);

  loginDialog = document.getElementById('login-dialog');
  setupDialog(loginDialog);

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.value.trim(),
      password: form.password.value,
    });
    submit.disabled = false;
    if (error) {
      showFormError(form, error.message === 'Invalid login credentials' ? 'E-mail ou senha inválidos.' : error.message);
      return;
    }
    loginDialog.close();
  });

  renderAuth();
  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    renderAuth();
    listeners.forEach((fn) => fn(currentUser));
  });
}
