import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Inicializa o servidor Express
app.listen(PORT, () => {
  console.log(`SmartVital API rodando em http://localhost:${PORT}`);
});