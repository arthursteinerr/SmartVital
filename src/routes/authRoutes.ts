import express from 'express';
import { AuthController } from '../controller/AuthController';

export const authRouter = express.Router();

const authController = new AuthController();

authRouter.post('/login', authController.login);
