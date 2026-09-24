# Munus

### Your tasks. In order.

Aplicação web inspirada em um quadro de post-its digitais, desenvolvida de ponta a ponta — da pesquisa de mercado e criação da experiência no Figma à implementação e persistência dos dados.

[Ver design no Figma](https://www.figma.com/design/PT5xDPT3pLIBb0c22Nk2dT/Munus---Your-tasks.-In-order.?node-id=0-1&t=JQjOM29upO9MOOW5-1)

## Sobre o projeto

O Munus foi criado para explorar uma arquitetura enxuta, de baixo acoplamento e pouca complexidade operacional, adequada à construção e validação rápida de MVPs.

- Frontend em React e TypeScript.
- Backend em Astro.
- PostgreSQL acessado por meio do PostgREST.
- Ambiente local executado com Docker Compose.

## Tecnologias

React · TypeScript · Astro · PostgreSQL · PostgREST · Docker · Figma

## Como executar

### Pré-requisitos

- Node.js 22.12 ou superior
- Docker com Docker Compose

### Desenvolvimento

1. Copie e preencha os arquivos de ambiente:

```bash
cp .env.example .env
cp react-app/.env.example react-app/.env
cp astro-app/.env.example astro-app/.env
```

Use `VITE_API_BASE_URL=/api` no ambiente do React e `POSTGREST_URL=http://localhost:3001` no ambiente do Astro. Defina também as credenciais do PostgreSQL e uma `JWT_SECRET_KEY`.

2. Instale as dependências e inicie os containers:

```bash
npm --prefix react-app install
npm --prefix astro-app install
docker compose up -d
```

3. Em dois terminais, execute:

```bash
npm run dev:astro
```

```bash
npm run dev:react
```

Acesse [http://localhost:5173/app/](http://localhost:5173/app/).

### Build

Com os containers em execução:

```bash
npm run build
npm run run-dist
```

Acesse [http://localhost:4321](http://localhost:4321).
