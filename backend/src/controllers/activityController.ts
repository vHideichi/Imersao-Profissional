import { Request, Response } from 'express';
import { criarAtividade, listarAtividades, listarHoras, registrarHoras, registrarPagamento } from '../services/storage';
export async function createActivity(req: Request, res: Response) { try { return res.status(201).json(await criarAtividade(req.body)); } catch (e:any) { return res.status(400).json({message:e.message}); } }
export async function getActivities(_req: Request, res: Response) { return res.json(await listarAtividades()); }
export async function createHourEntry(req: Request, res: Response) { try { return res.status(201).json(await registrarHoras(req.body)); } catch (e:any) { return res.status(400).json({message:e.message}); } }
export async function getHours(_req: Request, res: Response) { return res.json(await listarHoras()); }
export async function createPayment(req: Request, res: Response) { try { return res.status(201).json(await registrarPagamento(req.body)); } catch(e:any) { return res.status(400).json({message:e.message}); } }
