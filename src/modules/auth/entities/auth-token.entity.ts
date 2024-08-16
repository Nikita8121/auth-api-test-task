import { AuthToken } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class AuthTokenEntity implements AuthToken {
  id: number;
  deviceId: string;
  refreshToken: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AuthTokenEntity>) {
    Object.assign(this, partial);
  }

  update(refreshToken: string): this {
    this.refreshToken = refreshToken;
    return this;
  }

  static create(
    refreshToken: string,
    userId: number,
    deviceId: string,
  ): AuthTokenEntity {
    return new AuthTokenEntity({
      refreshToken,
      userId,
      deviceId,
    });
  }

  static generateDeviceId(): string {
    return uuidv4();
  }
}
