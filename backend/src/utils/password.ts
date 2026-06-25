import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => bcrypt.hashSync(password, SALT_ROUNDS);

export const comparePassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);
