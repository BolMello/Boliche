-- O app passa a exigir login: a leitura de jogadores deixa de ser pública.
drop policy if exists "jogador: leitura pública" on public.jogador;

create policy "jogador: leitura autenticada"
  on public.jogador for select
  to authenticated
  using (true);

-- Visitantes não autenticados (anon) não têm nenhum acesso à tabela.
revoke all on table public.jogador from anon;
