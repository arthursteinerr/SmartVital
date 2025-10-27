import { Request, Response } from "express";
import { getAllAgentesBusiness } from "../business/agenteBusiness";
import { getAgenteByIdBusiness } from "../business/agenteBusiness";
import { createAgenteBusiness } from "../business/agenteBusiness";
import { updateAgenteBusiness } from "../business/agenteBusiness";
import { deleteAgenteBusiness } from "../business/agenteBusiness";

//GET All Agentes
export const getAllAgentesController = async (req: Request, res: Response) => {
  const result = await getAllAgentesBusiness();
  
  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.data);
};

//GET Agentes By ID
export const getAgenteByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  const result = await getAgenteByIdBusiness(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.data);
};

//POST Agente
export const createAgenteController = async (req: Request, res: Response) => {
  const result = await createAgenteBusiness(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  return res.status(201).json(result.data);
};

//PATCH Atualiza Agente
export const updateAgenteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  const result = await updateAgenteBusiness(id, req.body);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.data);
};

//DELETE Agente
export const deleteAgenteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  const result = await deleteAgenteBusiness(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(204).send();
};
