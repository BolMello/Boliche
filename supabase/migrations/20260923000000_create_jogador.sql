-- Tabela de jogadores
create table public.jogador (
  id         bigint generated always as identity primary key,
  nome       text        not null check (length(trim(nome)) > 0),
  sexo       text        not null check (sexo in ('Masculino', 'Feminino')),
  created_at timestamptz not null default now()
);

comment on table  public.jogador      is 'Jogadores de boliche';
comment on column public.jogador.sexo is 'Masculino ou Feminino';

-- Row Level Security: a anon key é pública, então o acesso é controlado aqui.
alter table public.jogador enable row level security;

-- Qualquer visitante pode consultar os jogadores.
create policy "jogador: leitura pública"
  on public.jogador for select
  to anon, authenticated
  using (true);

-- Somente usuários autenticados podem cadastrar, alterar e excluir.
create policy "jogador: inserir autenticado"
  on public.jogador for insert
  to authenticated
  with check (true);

create policy "jogador: alterar autenticado"
  on public.jogador for update
  to authenticated
  using (true)
  with check (true);

create policy "jogador: excluir autenticado"
  on public.jogador for delete
  to authenticated
  using (true);
