# CAIXA Portal de Sistemas

Portal interno para centralização de acesso aos sistemas da Caixa — Hackathon Caixa.

## Stack

- **Angular 19** (standalone components, signals)
- Backend: .NET 8 API (opcional — mock habilitado por padrão)

## Como executar

```bash
cd caixa-portal
npm install
npm start
```

Acesse: http://localhost:4200

## Login de demonstração

| Matrícula | Usuário        |
|-----------|----------------|
| 000001    | Maria Silva    |
| 123456    | João Santos    |
| 654321    | Ana Oliveira   |

## Rotas

| Rota               | Descrição                    |
|--------------------|------------------------------|
| `/login`           | Tela de login por matrícula  |
| `/home`            | Dashboard personalizado      |
| `/search?q=...`    | Resultados de pesquisa       |
| `/solicitar-acesso`| Solicitação de acesso        |

## Integração com API

Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  useMock: false, // false para usar a API .NET
};
```

## Endpoints consumidos

- `POST /api/auth/login`
- `GET /api/sistemas/search`
- `POST /api/sistemas/clique`
- `POST /api/sistemas/favoritar`
- `POST /api/sistemas/solicitar-acesso`
