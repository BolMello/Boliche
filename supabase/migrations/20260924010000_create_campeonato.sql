-- Tabela de campeonatos
create table public.campeonato (
  id          bigint      generated always as identity primary key,
  descricao   text        not null check (length(trim(descricao)) > 0),
  ano         smallint    not null check (ano between 2000 and 2100),
  data_inicio date        not null,
  status      text        not null default 'Planejado'
                          check (status in ('Planejado', 'Em andamento', 'Encerrado')),
  created_at  timestamptz not null default now()
);

comment on table  public.campeonato        is 'Campeonatos de boliche';
comment on column public.campeonato.status is 'Planejado, Em andamento ou Encerrado';

-- Acesso somente para usuários autenticados; anon não tem nenhum acesso.
alter table public.campeonato enable row level security;
revoke all on table public.campeonato from anon;

create policy "campeonato: leitura autenticada"
  on public.campeonato for select
  to authenticated
  using (true);

create policy "campeonato: inserir autenticado"
  on public.campeonato for insert
  to authenticated
  with check (true);

create policy "campeonato: alterar autenticado"
  on public.campeonato for update
  to authenticated
  using (true)
  with check (true);

create policy "campeonato: excluir autenticado"
  on public.campeonato for delete
  to authenticated
  using (true);
