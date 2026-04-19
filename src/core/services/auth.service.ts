import { hashPassword } from '../../helpers/auth.helpers';
import { MSG_EXCEPTION } from '../constants/messages';
import UnauthorizedException from '../exceptions/unauthorizedException';
import usersRepository from '../repositories/user.repository';
import { UserRole } from '../models/user.model';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { instanceToPlain } from 'class-transformer';
import environment from '../../configs/environment';

import jwt from 'jsonwebtoken';

const scrypt = promisify(_scrypt);

class AuthService {
  private usersRepository = usersRepository;

  async signup(data: { email: string; password: string; phone: string; role: UserRole }) {
    const existing = await this.usersRepository.findByEmail(data.email);

    if (existing.length) {
      throw new UnauthorizedException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL);
    }

    const hashed = await hashPassword(data.password);

    const user = await this.usersRepository.create({
      email: data.email,
      phone: data.phone,
      password: hashed,
      role: data.role,
    });

    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException(MSG_EXCEPTION.OTHER_BAD_PASSWORD);
    }

    // ✅ serialize user (remove password)
    const userPlain = instanceToPlain(user) as any;
    delete userPlain.password;

    // ✅ generate tokens
    const { accessToken, refreshToken } = await this.generateUserTokens(userPlain);

    // ✅ return clean object
    return {
      ...userPlain,
      accessToken,
      refreshToken,
    };
  }

  async generateUserTokens(user) {
    delete user.password;
    const accessToken = jwt.sign({ user }, environment.ACCESS_TOKEN_SECRET, {
      expiresIn: '1m',
    });
    const refreshToken = jwt.sign({ user }, environment.REFRESH_TOKEN_SECRET);
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const user = await jwt.verify(refreshToken, environment.REFRESH_TOKEN_SECRET);
    const { accessToken } = await this.generateUserTokens(user);
    return { accessToken };
  }
}

export default new AuthService();
