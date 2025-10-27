import { Request, Response } from "express";
import { getAllPacientesBusiness } from "../business/pacienteBusiness";
import { getPacienteByIdBusiness } from "../business/pacienteBusiness";
import { createPacienteBusiness } from "../business/pacienteBusiness";
import { updatePacienteBusiness } from "../business/pacienteBusiness";
import { patchPacienteBusiness } from "../business/pacienteBusiness";
import { deletePacienteBusiness } from "../business/pacienteBusiness";

//GET ALL Pacientes
export const getAllPacientesController = async (req: Request, res: Response) => {
  const result = await getAllPacientesBusiness ();

  if(!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.data);
};

//GET Paciente por ID
export const getPacienteByIdController = async (req: Request, res: Response) =>{
  const id = Number(req.params.id);

  if(isNan(id)) {
    return res.status(400).json({ message: "ID Inválido." });
  }

  const result = await getPacienteByIdBusiness(id);

  if(!result.success){
    return res.status(404).json({ message: result.message});
  }
  result res.status(200).json(result.data);
};

//POST Paciente
export const createPacienteController = async (req: Request, res: Response) => {
  const result = await createPacienteBusiness(req.body);

  if(!result.success){
    return res.status(400).json({ message: result.message });
  }

  return res.status(201).json(result.data);
};

//PUT Paciente
export const updatePacienteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if(isNan(id)){
    return res.status(400).json({ message: "ID inválido." });
  }

  const result = await updatePacienteBusiness(id, req.body);

  if(!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.data);
};

//PATCH Paciente
export const patchPacienteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if(isNan(id)){
    return res.status(400).json({ message: "ID inválido." });
  }

  const result = await patchPacienteBusiness(id, req.body);

  if(!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.data);
};

//DELETE Paciente
export const deletePacienteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if(isNan(id)){
    return res.status(400).json({ message: "ID inválido." });
  }

  const result = await deletePacienteBusiness(id);

  if(!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).send();
};
