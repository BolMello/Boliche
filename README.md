# Boliche PMFC

App web de boliche feito em HTML/CSS/JavaScript puro, com banco de dados no [Supabase](https://supabase.com) e hospedagem no GitHub Pages.

## Estrutura

```
index.html        Página inicial
css/style.css     Estilos
js/config.js      URL e anon key do Supabase
js/supabase.js    Cliente Supabase (supabase-js v2 via CDN)
js/app.js         Lógica da página (teste de conexão)
```

## Configuração do Supabase

1. No painel do Supabase, abra **Project Settings → API**.
2. Copie a **Project URL** e a **anon / publishable key** para `js/config.js`.
3. **Nunca** use a `service_role` key no front-end nem a coloque no repositório.

A anon key é pública por design. Os dados ficam protegidos por **Row Level Security (RLS)**, que deve ser ativada em todas as tabelas quando elas forem criadas.

## Usuários (login)

O app só pode ser acessado por usuários cadastrados: `login.html` é a porta de entrada e as demais páginas redirecionam para ela sem sessão. No banco, as tabelas não dão nenhum acesso ao papel `anon`, e o cadastro público está desligado (**Authentication → Sign In / Providers → Allow new users to sign up** desmarcado).

Para criar um usuário: painel do Supabase → **Authentication → Users → Add user → Create new user**, informe e-mail e senha e marque **Auto Confirm User**.

## Rodar localmente

Módulos ES não funcionam abrindo o arquivo direto (`file://`). Use um servidor local:

- VS Code: extensão **Live Server** → botão direito em `index.html` → *Open with Live Server*; ou
- Python: `python -m http.server 8000` e acesse http://localhost:8000

A página deve mostrar **✅ Conectado ao Supabase**.

## Deploy (GitHub Pages)

1. No repositório no GitHub: **Settings → Pages**.
2. Em *Build and deployment*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O app ficará em `https://<usuario>.github.io/<repositorio>/`.
