export async function getUser(req, res, usersRepository) {
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
