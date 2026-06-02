import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './services/api';
import './styles/global.css';

type Cliente = { id: string; name: string; email: string; phone: string };
type Projeto = { id: string; name: string; description: string; client_id: string };

function App() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [tempo, setTempo] = useState(0);

  async function carregar() {
    const c = await api.get('/clients');
    const p = await api.get('/projects');
    setClientes(c.data);
    setProjetos(p.data);
  }

  useEffect(() => {
    carregar();
    const timer = window.setInterval(() => setTempo(current => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function cadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/clients', { name, email, phone });
    setName('');
    setEmail('');
    setPhone('');
    setStatus('Cliente cadastrado com sucesso.');
    await carregar();
  }

  async function criarProjetoDemo() {
    if (!clientes[0]) {
      setStatus('Cadastre um cliente antes de criar projeto.');
      return;
    }
    await api.post('/projects', {
      name: 'Website Institucional',
      description: 'Projeto de exemplo para apresentação.',
      client_id: clientes[0].id
    });
    await carregar();
    setStatus('Projeto de exemplo cadastrado.');
  }

  return <div className="app">
    <aside>
      <h1>FreelanceFlow</h1>
      <p>Gestão de serviços freelancers</p>
      <a href="#dashboard">Dashboard</a>
      <a href="#clientes">Clientes</a>
      <a href="#projetos">Projetos</a>
      <a href="#relatorios">Relatórios</a>
    </aside>
    <main>
      <section id="dashboard" className="grid">
        <div className="card"><span>Clientes</span><strong>{clientes.length}</strong></div>
        <div className="card"><span>Projetos</span><strong>{projetos.length}</strong></div>
        <div className="card"><span>Horas</span><strong>35h</strong></div>
        <div className="card"><span>PIX</span><strong>R$ 1.500</strong></div>
      </section>
      <section id="clientes" className="panel">
        <h2>Cadastro de Cliente - caso de uso implementado</h2>
        <form onSubmit={cadastrarCliente}>
          <input placeholder="Nome do cliente" value={name} onChange={e => setName(e.target.value)} required />
          <input placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} required />
          <button type="submit">Salvar cliente</button>
        </form>
        {status && <p className="status">{status}</p>}
        <table>
          <thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th></tr></thead>
          <tbody>{clientes.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td></tr>)}</tbody>
        </table>
      </section>
      <section id="projetos" className="panel">
        <h2>Projetos</h2>
        <button onClick={criarProjetoDemo}>Criar projeto de exemplo</button>
        <ul>{projetos.map(p => <li key={p.id}><strong>{p.name}</strong> - {p.description}</li>)}</ul>
      </section>
      <section className="panel">
        <h2>WebSocket - cronômetro de atividade</h2>
        <p>Tempo recebido via Socket.IO: {tempo}s</p>
        <p>Este módulo representa o acompanhamento em tempo real previsto no tema.</p>
      </section>
      <section id="relatorios" className="panel">
        <h2>Relatório de horas</h2>
        <p>Total demonstrativo: 35 horas trabalhadas.</p>
      </section>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
