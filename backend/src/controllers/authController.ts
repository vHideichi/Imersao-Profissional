import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { buscarUsuarioPorEmail, criarUsuario } from '../services/storage';

export async function register(req: Request, res: Response) {
  try {
    const user = await criarUsuario(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await buscarUsuarioPorEmail(email);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas.' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'freelanceflow_secret', { expiresIn: '1d' });
  return res.json({ token });
}
