import bcrypt from 'bcryptjs';
import { pool } from '../db/pool';

export type ClienteInput = { name: string; email: string; phone: string };
export type ProjetoInput = { name: string; description: string; client_id: string; status?: string };
export type AtividadeInput = { description: string; project_id: string; status?: string };

const memory = {
  clients: [] as any[],
  projects: [] as any[],
  activities: [] as any[],
  hours: [] as any[],
  payments: [] as any[],
  users: [] as any[]
};

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function useMemory() {
  return process.env.NODE_ENV === 'test' || !process.env.DATABASE_URL;
}

export async function garantirTabelas() {
  if (useMemory()) return;
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(150) NOT NULL, email VARCHAR(150) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS clients (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(150) NOT NULL, email VARCHAR(150) NOT NULL, phone VARCHAR(30) NOT NULL, created_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(150) NOT NULL, description TEXT NOT NULL, status VARCHAR(50) NOT NULL DEFAULT 'EM_ANDAMENTO', client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS activities (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), description VARCHAR(255) NOT NULL, status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE', project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS hour_entries (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), worked_hours NUMERIC(10,2) NOT NULL CHECK (worked_hours > 0), activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS payments (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), value NUMERIC(10,2) NOT NULL CHECK (value > 0), method VARCHAR(30) NOT NULL DEFAULT 'PIX', status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE', project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT NOW());
  `);
}

export async function criarUsuario(data: { name: string; email: string; password: string }) {
  if (!data.name || !data.email || !data.password) throw new Error('Nome, e-mail e senha são obrigatórios.');
  const hash = await bcrypt.hash(data.password, 8);
  if (useMemory()) {
    if (memory.users.some(u => u.email === data.email)) throw new Error('E-mail já cadastrado.');
    const user = { id: id(), name: data.name, email: data.email, password: hash };
    memory.users.push(user);
    return { id: user.id, name: user.name, email: user.email };
  }
  const result = await pool.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email', [data.name, data.email, hash]);
  return result.rows[0];
}

export async function buscarUsuarioPorEmail(email: string) {
  if (useMemory()) return memory.users.find(u => u.email === email);
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  return result.rows[0];
}

export async function criarCliente(data: ClienteInput) {
  if (!data.name || !data.email || !data.phone) throw new Error('Nome, e-mail e telefone são obrigatórios.');
  if (useMemory()) {
    const client = { id: id(), ...data };
    memory.clients.push(client);
    return client;
  }
  const result = await pool.query('INSERT INTO clients (name,email,phone) VALUES ($1,$2,$3) RETURNING *', [data.name, data.email, data.phone]);
  return result.rows[0];
}

export async function listarClientes() {
  if (useMemory()) return memory.clients;
  return (await pool.query('SELECT * FROM clients ORDER BY created_at DESC')).rows;
}

export async function atualizarCliente(idCliente: string, data: ClienteInput) {
  if (!data.name || !data.email || !data.phone) throw new Error('Nome, e-mail e telefone são obrigatórios.');
  if (useMemory()) {
    const index = memory.clients.findIndex(c => c.id === idCliente);
    if (index < 0) throw new Error('Cliente não encontrado.');
    memory.clients[index] = { ...memory.clients[index], ...data };
    return memory.clients[index];
  }
  const result = await pool.query('UPDATE clients SET name=$1,email=$2,phone=$3 WHERE id=$4 RETURNING *', [data.name, data.email, data.phone, idCliente]);
  if (!result.rows[0]) throw new Error('Cliente não encontrado.');
  return result.rows[0];
}

export async function removerCliente(idCliente: string) {
  if (useMemory()) {
    memory.clients = memory.clients.filter(c => c.id !== idCliente);
    return;
  }
  await pool.query('DELETE FROM clients WHERE id=$1', [idCliente]);
}

export async function criarProjeto(data: ProjetoInput) {
  if (!data.name || !data.description || !data.client_id) throw new Error('Nome, descrição e cliente são obrigatórios.');
  if (useMemory()) {
    const project = { id: id(), status: 'EM_ANDAMENTO', ...data };
    memory.projects.push(project);
    return project;
  }
  return (await pool.query('INSERT INTO projects (name,description,status,client_id) VALUES ($1,$2,$3,$4) RETURNING *', [data.name, data.description, data.status || 'EM_ANDAMENTO', data.client_id])).rows[0];
}

export async function listarProjetos() {
  if (useMemory()) return memory.projects;
  return (await pool.query('SELECT * FROM projects ORDER BY created_at DESC')).rows;
}

export async function criarAtividade(data: AtividadeInput) {
  if (!data.description || !data.project_id) throw new Error('Descrição e projeto são obrigatórios.');
  if (useMemory()) {
    const activity = { id: id(), status: 'PENDENTE', ...data };
    memory.activities.push(activity);
    return activity;
  }
  return (await pool.query('INSERT INTO activities (description,status,project_id) VALUES ($1,$2,$3) RETURNING *', [data.description, data.status || 'PENDENTE', data.project_id])).rows[0];
}

export async function listarAtividades() {
  if (useMemory()) return memory.activities;
  return (await pool.query('SELECT * FROM activities ORDER BY created_at DESC')).rows;
}

export async function registrarHoras(data: { worked_hours: number; activity_id: string }) {
  if (Number(data.worked_hours) <= 0 || !data.activity_id) throw new Error('Horas positivas e atividade são obrigatórias.');
  if (useMemory()) {
    const entry = { id: id(), ...data };
    memory.hours.push(entry);
    return entry;
  }
  return (await pool.query('INSERT INTO hour_entries (worked_hours,activity_id) VALUES ($1,$2) RETURNING *', [data.worked_hours, data.activity_id])).rows[0];
}

export async function listarHoras() {
  if (useMemory()) return memory.hours;
  return (await pool.query('SELECT * FROM hour_entries ORDER BY created_at DESC')).rows;
}

export async function registrarPagamento(data: { value: number; method?: string; status?: string; project_id: string }) {
  if (Number(data.value) <= 0 || !data.project_id) throw new Error('Valor positivo e projeto são obrigatórios.');
  if (useMemory()) {
    const payment = { id: id(), method: 'PIX', status: 'PENDENTE', ...data };
    memory.payments.push(payment);
    return payment;
  }
  return (await pool.query('INSERT INTO payments (value,method,status,project_id) VALUES ($1,$2,$3,$4) RETURNING *', [data.value, data.method || 'PIX', data.status || 'PENDENTE', data.project_id])).rows[0];
}
