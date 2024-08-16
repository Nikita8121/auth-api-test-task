import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from '@nestjs/jwt';
import { decode, JwtPayload, verify } from 'jsonwebtoken';
import { ERRORS } from 'libs/contracts';

@Injectable()
export class JwtAuthGuard {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(JwtAuthGuard.name);

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const token = context
        .switchToHttp()
        .getRequest()
        .headers?.authorization.split(' ')
        .pop();
      if (!token) return false;

      const isTokenValid = verify(
        token,
        this.configService.getOrThrow('JWT_SECRET'),
      );
      if (!isTokenValid) return false;

      const decoded = decode(token) as JwtPayload;
      if (!decoded) return false;

      context.switchToHttp().getRequest().accountSession = decoded;

      return true;
    } catch (e) {
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
