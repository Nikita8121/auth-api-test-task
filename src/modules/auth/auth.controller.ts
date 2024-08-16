import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SignInRequestDto, SignInResponseDto } from './dto/sign-in.dto';
import { SignUpRequestDto, SignUpResponseDto } from './dto/sign-up.dto';
import { AuthService } from './services/auth.service';
import {
  errorHandler,
  errorHandlerWithNull,
} from 'src/common/helpers/error-handler.helper';
import { JwtPayload } from './type/jwtPlayload.type';
import { UserSessionInfo } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDto> {
    const res = await this.authService.signIn(dto);

    const data = errorHandler(res);

    return {
      data,
    };
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const res = await this.authService.signUp(dto);

    errorHandler(res);

    return {
      data: {
        success: true,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@UserSessionInfo() session: JwtPayload) {
    const res = await this.authService.logout(session.deviceId);

    errorHandlerWithNull(res);

    return {
      data: {
        success: true,
      },
    };
  }
}
