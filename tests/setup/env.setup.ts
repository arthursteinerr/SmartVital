import dotenv from "dotenv";
dotenv.config({ path: ".env.test" }); // Fixando .env.test como as configuracoes de ambiente a serem usadas durante os testes

process.env.NODE_ENV = "test";