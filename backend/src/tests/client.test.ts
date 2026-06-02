process.env.NODE_ENV = 'test';
import request from 'supertest';
import { app } from '../app';

describe('UC01 - Cadastrar Cliente', () => {
  it('deve cadastrar um cliente e retornar status 201', async () => {
    const response = await request(app).post('/clients').send({
      name: 'Empresa Teste',
      email: 'contato@empresateste.com',
      phone: '44999999999'
    });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Empresa Teste');
  });
});
