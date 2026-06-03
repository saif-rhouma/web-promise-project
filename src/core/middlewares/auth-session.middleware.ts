import { NextFunction, Request, Response } from 'express';
import Middleware from 'src/types/Middleware';
import UnauthorizedException from '../exceptions/unauthorizedException';
import { MSG_EXCEPTION } from '../constants/messages';
import usersRepository from '../repositories/user.repository';

const authSessionMiddleware: Middleware<void> = async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.session['user']?.id;

  if (!userId) {
    return next(
      new UnauthorizedException(`${MSG_EXCEPTION.UNAUTHORIZED_TOKEN}, ${MSG_EXCEPTION.UNAUTHORIZED_TOKEN_EXPIRED}`)
    );
  }

  const user = await usersRepository.findOne({
    where: { id: userId },
    relations: ['startupProfile'],
  });

  if (!user) {
    return next(
      new UnauthorizedException(`${MSG_EXCEPTION.UNAUTHORIZED_TOKEN}, ${MSG_EXCEPTION.UNAUTHORIZED_TOKEN_EXPIRED}`)
    );
  }

  req['user'] = user;

  next();
};
export default authSessionMiddleware;
