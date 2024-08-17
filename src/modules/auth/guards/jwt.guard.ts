import {
  ExecutionContext,
  Global,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from '@nestjs/jwt';
import { ERRORS } from 'libs/contracts';
import { AuthTokenRepository } from '../auth-token.repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly configService: ConfigService,
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  private readonly logger = new Logger(JwtAuthGuard.name);

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const token = context
        .switchToHttp()
        .getRequest()
        .headers?.authorization.split(' ')
        .pop();

      if (!token) {
        return false;
      }

      const isTokenValid = await this.tokenService.validateToken(
        token,
        this.configService.getOrThrow('JWT_SECRET'),
      );

      if (!isTokenValid) {
        return false;
      }

      const decoded = await this.tokenService.decodeToken(token);
      if (!decoded) {
        return false;
      }

      const authTokenEntity = await this.authTokenRepository.findByDeviceId(
        decoded.deviceId,
      );

      if (!authTokenEntity) {
        return false;
      }

      context.switchToHttp().getRequest().accountSession = decoded;

      return true;
    } catch (e) {
      this.logger.error(`Error: ${e.message}`);
      if (
        e instanceof TokenExpiredError ||
        e instanceof UnauthorizedException
      ) {
        throw new UnauthorizedException(ERRORS.NO_TOKEN.code);
      }

      return false;
    }
  }
}
