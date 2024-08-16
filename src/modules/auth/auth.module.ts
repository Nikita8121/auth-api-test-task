import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './auth-token.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/common/config/jwt';
import { TokenService } from './services/token.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.registerAsync(getJWTConfig())],
  providers: [JwtStrategy, AuthService, AuthRepository, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
