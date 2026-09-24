import { supabase } from './supabase.js';
import { insertIcons, paginaDestino, showFormError } from './layout.js';

// Já logado: vai direto para o app.
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  location.replace(paginaDestino());
} else {
  insertIcons();
  delete document.body.dataset.auth;
}

const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  form.querySelector('.form-error').hidden = true;

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
  location.replace(paginaDestino());
});
