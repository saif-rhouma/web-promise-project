import usersRepository from '../repositories/user.repository';

class UsersService {
  private readonly usersRepository = usersRepository;
  create() {
    return this.usersRepository.create({ email: 'test@gmail.com', password: '0000' });
  }
  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  registrationsByMonth() {
    return this.usersRepository.registrationsByMonth();
  }
}

export default new UsersService();
