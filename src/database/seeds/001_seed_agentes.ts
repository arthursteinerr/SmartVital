import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  await knex("agentes").del();

  const hash1 = await bcrypt.hash("12345", 10);
  const hash2 = await bcrypt.hash("abcde", 10);

  await knex("agentes").insert([
    {
      nome: "Dra. Camila Nunes",
      senha: hash1,
      cargo: "Médico",
      registro_profissional: "CRM-SP-456789",
      data_admissao: "2022-10-05",
    },
    {
      nome: "Enf. Pedro Lima",
      senha: hash2,
      cargo: "Enfermeiro",
      registro_profissional: "COREN-123456",
      data_admissao: "2023-01-11",
    },
  ]);
}