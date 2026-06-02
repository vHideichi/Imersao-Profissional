import { Request, Response } from 'express';
import { criarProjeto, listarProjetos } from '../services/storage';
export async function createProject(req: Request, res: Response) { try { return res.status(201).json(await criarProjeto(req.body)); } catch (e:any) { return res.status(400).json({message:e.message}); } }
export async function getProjects(_req: Request, res: Response) { return res.json(await listarProjetos()); }
