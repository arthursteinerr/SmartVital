import { Request, Response } from 'express';
import { AuthBusiness } from '../business/authBusiness';
import { LoginInput } from '../dto/authDTO';

export class AuthController {
    authBusiness = new AuthBusiness();

    public login = async (req: Request, res: Response) => {
        try {
            const { registro_profissional, senha } = req.body as LoginInput;
            const result = await this.authBusiness.login({registro_profissional, senha});

            res.status(200).send(result);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    };
}
