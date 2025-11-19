const knexConfig = require("../../knexfile.js");
const knex = require("knex");

async function resetDB() {
  const config = knexConfig.test;
  const db = knex(config);

  await db.migrate.rollback(undefined, true);
  await db.migrate.latest();
  await db.seed.run();

  await db.destroy();
}

module.exports = resetDB;