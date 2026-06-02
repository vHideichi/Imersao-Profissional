# FreelanceFlow

**Aluno:** Victor Hideichi Mancini Suzuki  
**Disciplina:** Imersão Profissional: Projeto de Software  
**Tema:** Sistema de Gestão de Serviços Freelancers

## Sobre o projeto

O FreelanceFlow é uma aplicação web para controle de clientes, projetos, atividades, horas trabalhadas e pagamentos de um freelancer. O caso de uso implementado e testado é o **UC01 - Cadastrar Cliente**.

## Tecnologias

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Banco: PostgreSQL
- Tempo real: Socket.IO no backend
- Testes: Jest + Supertest
- ORM/esquema: Prisma
- Containerização: Docker Compose

## Como executar

```bash
docker compose up --build
```

Acessos:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health

## Testes

```bash
docker compose exec backend npm test
```

## Documentação principal

Os arquivos finais em PDF estão em `docs/pdf`:

- documento-requisitos.pdf
- documento-casos-de-uso.pdf
- documento-arquitetura.pdf
- diagrama-casos-uso.pdf
- diagrama-classes.pdf
- der.pdf
- relatorio-sprints-jira.pdf
- roteiro-video.pdf
- relatorio-validacao-professor.pdf

## Diagramas editáveis

- `docs/drawio`: arquivos editáveis para diagrams.net / draw.io.
- `docs/diagramas`: fontes DOT, PNG e SVG dos diagramas.
- `docs/sql/modelo_mysql_workbench.sql`: script compatível para modelagem no MySQL Workbench.
