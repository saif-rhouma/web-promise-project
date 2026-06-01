import { getMonthExpression } from '../../helpers/getMonthExpression.helpers';
import AppDataSource from '../../database/data-source';
import { ProfileType, User } from '../models/user.model';
import BaseRepository from './baseRepository';
import { IsNull, Not } from 'typeorm';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }

  countStartups() {
    return this.repo.count({
      where: {
        type: ProfileType.STARTUP,
      },
    });
  }

  countEnterprise() {
    return this.repo.count({
      where: {
        type: ProfileType.ENTERPRISE,
      },
    });
  }

  countWithType(type: ProfileType) {
    return this.repo.count({
      where: {
        type: type,
      },
    });
  }

  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }

  registrationsByMonth() {
    const monthExpr = getMonthExpression('user.createdAt');
    return this.repo
      .createQueryBuilder('user')
      .select(monthExpr, 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async findAllAccounts(skip: number, limit: number) {
    return this.repo.find({
      where: {
        type: Not('UNKNOWN'),
        startupProfile: {
          id: Not(IsNull()),
        },
      },
      relations: ['startupProfile'],
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });
  }
}

export default new UserRepository();
