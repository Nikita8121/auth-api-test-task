import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/common/config/jwt';
import { TokenService } from './services/token.service';
import { AuthController } from './auth.controller';
import { AuthTokenRepository } from './auth-token.repository';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt.guard';

@Global()
@Module({
  imports: [JwtModule.registerAsync(getJWTConfig()), UserModule],
  providers: [
    TokenService,
    JwtStrategy,
    AuthService,
    AuthTokenRepository,
  ],
  exports: [AuthTokenRepository, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
