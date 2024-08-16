import { User } from '@prisma/client';
import { genSalt } from 'src/common/utils/gen-salt.util';
import { compare, hash } from 'src/common/utils/hash-password.util';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  public validatePassword(password: string, pepper: string): Promise<boolean> {
    return compare(password + pepper, this.passwordHash);
  }

  async setPassword(password: string, pepper: string): Promise<this> {
    const salt = await genSalt();
    this.passwordHash = await hash(password + pepper, salt);
    return this;
  }
}
