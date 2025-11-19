import knexConfig from "../../knexfile";
import knex from "knex";

export default async () => {
  const db = knex(knexConfig.test);

  await db.migrate.rollback(undefined, true);
  await db.migrate.latest();
  await db.seed.run();

  await db.destroy();
};