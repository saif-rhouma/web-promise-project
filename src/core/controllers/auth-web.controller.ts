import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import HTTP_CODE from '../constants/httpCode';
import { Request, Response } from 'express';
import { UserRole } from '../models/user.model';
import authService from '../services/auth.service';

class AuthWebController {
  // ======================
  // LOGIN PAGE
  // ======================
  loginPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    return res.render('pages/auth/login', {
      csrfToken: req.csrfToken(),
      error: null,
    });
  };

  // ======================
  // LOGIN ACTION
  // ======================
  login: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HTTP_CODE.BadRequest).render('pages/auth/login', {
          csrfToken: req.csrfToken(),
          error: 'Email and password are required',
        });
      }

      const user = await authService.login(email, password);

      // ✅ Store user in session
      req.session['user'] = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      // (optional) store token if needed
      req.session['accessToken'] = user.accessToken;

      // ✅ Redirect based on role
      if (user.role === UserRole.STARTUP) {
        return res.redirect('/startup/profile');
      }

      return res.redirect('/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err: any) {
      const message = 'Invalid credentials';

      return res.status(HTTP_CODE.Unauthorized).render('pages/auth/login', {
        csrfToken: req.csrfToken(),
        error: message,
      });
    }
  };

  // ======================
  // REGISTER PAGE
  // ======================
  registerPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    return res.render('pages/auth/register', {
      csrfToken: req.csrfToken(),
    });
  };

  // ======================
  // REGISTER ACTION
  // ======================

  register = async (req: Request, res: Response) => {
    const { email, password, phone } = req.body;

    await authService.signup({
      email,
      password,
      phone,
      role: UserRole.STARTUP,
    });

    return res.redirect('/auth/login');
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
