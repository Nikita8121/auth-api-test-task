import * as bcrypt from 'bcryptjs';

export async function genSalt(): Promise<string> {
  return bcrypt.genSalt(10);
}
