import express from 'express';
import { authController } from '../controller/authController';

export const authRouter = express.Router();

const authController = new AuthController();

authRouter.post('/login', authController.login);
