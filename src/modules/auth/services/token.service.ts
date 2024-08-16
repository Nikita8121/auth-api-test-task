import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../type/jwtPlayload.type';
import { AuthTokenEntity } from '../entities/auth-token.entity';
import { TokenData } from '../type/token-data.type';
import { AuthTokenRepository } from '../auth-token.repository';
import { ICommandResponse } from 'src/common/interface/command-response.type';
import { ERRORS } from 'libs/contracts';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshSecret: string;
  private jwtRefreshExpiresIn: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authTokenRepository: AuthTokenRepository,
  ) {
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
    this.jwtExpiresIn = this.configService.getOrThrow('JWT_ACCESS_EXPIRATION');
    this.jwtRefreshSecret = this.configService.getOrThrow('JWT_REFRESH_SECRET');
    this.jwtRefreshExpiresIn = this.configService.getOrThrow(
      'JWT_REFRESH_EXPIRATION',
    );
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<ICommandResponse<TokenData>> {
    try {
      const isRefreshTokenValid = await this.validateToken(
        refreshToken,
        this.jwtRefreshSecret,
      );

      if (!isRefreshTokenValid) {
        this.logger.error(`Refresh token is invalid`);
        return {
          isSuccess: false,
          code: ERRORS.TOKEN_WAS_CHANGED.code,
          message: ERRORS.TOKEN_WAS_CHANGED.message,
        };
      }

      const decodedToken = await this.decodeToken(refreshToken);

      const deviceId = decodedToken.deviceId;

      const authTokenEntity =
        await this.authTokenRepository.findByDeviceId(deviceId);

      if (!authTokenEntity) {
        this.logger.error(`Refresh token not found`);
        return {
          isSuccess: false,
          code: ERRORS.TOKEN_WAS_CHANGED.code,
          message: ERRORS.TOKEN_WAS_CHANGED.message,
        };
      }

      const tokens = await this.generateTokens(decodedToken);

      await this.authTokenRepository.update(
        authTokenEntity.update(tokens.refreshToken),
      );

      return {
        isSuccess: true,
        data: tokens,
      };
    } catch (e) {
      this.logger.error(`Failed to refresh token`, e);
      return {
        isSuccess: false,
        code: ERRORS.TOKEN_REFRESH_FAILED.code,
        message: ERRORS.TOKEN_REFRESH_FAILED.message,
      };
    }
  }

  public async createTokensForUser(
    userId: number,
  ): Promise<ICommandResponse<TokenData>> {
    try {
      const deviceId = AuthTokenEntity.generateDeviceId();

      const payload: JwtPayload = {
        userId,
        deviceId: AuthTokenEntity.generateDeviceId(),
      };

      const tokens = await this.generateTokens(payload);

      const authTokenEntity = AuthTokenEntity.create(
        tokens.refreshToken,
        userId,
        deviceId,
      );

      await this.authTokenRepository.create(authTokenEntity);

      return {
        isSuccess: true,
        data: tokens,
      };
    } catch (e) {
      this.logger.error(`Failed to generate tokens for user ${userId}`, e);
      return {
        isSuccess: false,
        code: ERRORS.TOKEN_GENERATION_FAILED.code,
        message: ERRORS.TOKEN_GENERATION_FAILED.message,
      };
    }
  }

  private async generateTokens(payload: JwtPayload): Promise<TokenData> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        userId: payload.userId,
        deviceId: payload.deviceId,
      } as JwtPayload,
      {
        expiresIn: this.jwtExpiresIn,
        secret: this.jwtSecret,
      },
    );
  }

  private generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        userId: payload.userId,
        deviceId: payload.deviceId,
      } as JwtPayload,
      {
        expiresIn: this.jwtRefreshExpiresIn,
        secret: this.jwtRefreshSecret,
      },
    );
  }

  public async decodeToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.decode(token);
  }

  public async validateToken(token: string, secret: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async deleteToken(deviceId: string): Promise<ICommandResponse> {
    try {
      const [token] = await this.authTokenRepository.findByCriteria({
        deviceId,
      });

      if (!token) {
        this.logger.error(`Token not found by device id: ${deviceId}`);
        return {
          isSuccess: false,
          code: ERRORS.TOKEN_NOT_FOUND.code,
          message: ERRORS.TOKEN_NOT_FOUND.message,
        };
      }

      await this.authTokenRepository.deleteByDeviceId(deviceId);

      return {
        isSuccess: true,
        data: null,
      };
    } catch (e) {
      this.logger.error(`Failed to delete token by device id`, e);
      return {
        isSuccess: false,
        code: ERRORS.TOKEN_DELETE_FAILED.code,
        message: ERRORS.TOKEN_DELETE_FAILED.message,
      };
    }
  }
}
