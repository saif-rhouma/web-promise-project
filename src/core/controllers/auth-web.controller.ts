import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import HTTP_CODE from '../constants/httpCode';
import { Request, Response } from 'express';

class AuthWebController {
  // ======================
  // LOGIN PAGE
  // ======================
  loginPage: AsyncRouteHandler = async (_req: Request, res: Response) => {
    return res.render('pages/auth/login');
  };

  // ======================
  // LOGIN ACTION
  // ======================
  login: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // TODO: add validation + DB check later
      if (!email || !password) {
        return res.status(HTTP_CODE.BadRequest).send('Missing credentials');
      }

      // fake login for now
      req.session['user'] = {
        id: 1,
        email,
        role: 'candidate',
      };

      return res.redirect('/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return res.status(HTTP_CODE.InternalServerError).send('Login failed');
    }
  };

  // ======================
  // REGISTER PAGE
  // ======================
  registerPage: AsyncRouteHandler = async (_req: Request, res: Response) => {
    return res.render('pages/auth/register');
  };

  // ======================
  // REGISTER ACTION
  // ======================
  register: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HTTP_CODE.BadRequest).send('Missing fields');
      }

      // TODO: save user in DB (TypeORM)

      return res.redirect('pages/auth/login');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return res.status(HTTP_CODE.InternalServerError).send('Registration failed');
    }
  };

  // ======================
  // LOGOUT
  // ======================
  logout: AsyncRouteHandler = async (req: Request, res: Response) => {
    req.session.destroy(() => {
      return res.redirect('pages/auth/login');
    });
  };
}

export default new AuthWebController();
