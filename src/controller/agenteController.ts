import { Request, Response } from "express";
import { getAgenteByIdBusiness } from "../business/agenteBusiness";
import { createAgenteBusiness } from "../business/agenteBusiness";
import { updateAgenteBusiness } from "../business/agenteBusiness";
import { deleteAgenteBusiness } from "../business/agenteBusiness";
import { AgenteFilterDTO } from "../dto/agenteFilterDTO";
import { getAllAgentes } from "../data/agenteData";

//GET All Agentes
export const getAgentesController = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      cargo,
      registro_profissional,
      page = "1",
      limit = "10",
      sortBy = "id",
      sortOrder = "asc",
    } = req.query;

    const headerLimit = req.headers["limit"];
    const headerPage = req.headers["page"];
    const headerSortBy = req.headers["sortBy"]
    const headerSortOrder = req.headers["sortOrder"]

    const filter: Required<AgenteFilterDTO> = {
      nome: (nome as string) || "",
      cargo: (cargo as string) || "",
      registro_profissional: (registro_profissional as string) || "",
      page: Number(headerPage || page) || 1,
      limit: Number(headerLimit || limit) || 10,
      sortBy: (sortBy as string) as any,
      sortOrder: (sortOrder as string) === "desc" ? "desc" : "asc",
    };

    const result = await getAllAgentes(filter);
    res.status(200).json(result);

  } catch (error: any) {
      console.error("Erro no controller de agentes:", error);
      res.status(500).json({ error: error.message });
  }
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
