// Configuração do Supabase (Project Settings → API).
// A anon/publishable key é pública por design em apps front-end:
// a proteção dos dados é feita por Row Level Security (RLS) nas tabelas.
// NUNCA coloque a service_role key aqui.
export const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
export const SUPABASE_ANON_KEY = 'SUA-ANON-KEY';
