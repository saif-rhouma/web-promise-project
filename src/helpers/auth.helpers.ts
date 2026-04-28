import { scrypt as _scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function hashPassword(password: string) {
  // Hash the users password
  // Generate a salt
  const salt = randomBytes(8).toString('hex');
  // Hash the salt and the password together
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  // Join the hashed result and the salt together
  const result = `${salt}.${hash.toString('hex')}`;
  return result;
}

export async function comparePassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  const [salt, storedHash] = storedPassword.split('.');

  const hash = (await scrypt(suppliedPassword, salt, 32)) as Buffer;

  return timingSafeEqual(Buffer.from(storedHash, 'hex'), hash);
}
