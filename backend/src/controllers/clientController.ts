import { Request, Response } from 'express';
import { atualizarCliente, criarCliente, listarClientes, removerCliente } from '../services/storage';

export async function createClient(req: Request, res: Response) {
  try {
    return res.status(201).json(await criarCliente(req.body));
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getClients(_req: Request, res: Response) {
  return res.json(await listarClientes());
}

export async function updateClient(req: Request, res: Response) {
  try {
    return res.json(await atualizarCliente(req.params.id, req.body));
  } catch (error: any) {
    return res.status(error.message.includes('não encontrado') ? 404 : 400).json({ message: error.message });
  }
}

export async function deleteClient(req: Request, res: Response) {
  await removerCliente(req.params.id);
  return res.status(204).send();
}
