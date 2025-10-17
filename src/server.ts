//Arthur Steiner Morais Silva

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/pacienteRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
