import { Response } from 'express';
import { AuthRequest } from 'src/types/AuthRequest';
export async function getUser(req: AuthRequest, res: Response, usersRepository) {
  const userId = req.session['user']?.id;

  if (!userId) {
    return res.redirect('/auth/login');
  }

  const user = await usersRepository.findOne({
    where: { id: userId },
    relations: ['startupProfile'],
  });

  if (!user) {
    return res.redirect('/auth/login');
  }

  return user;
}
