import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { ICommandResponse } from 'src/common/interface/command-response.type';
import { ERRORS } from 'libs/contracts';
import { UserService } from 'src/modules/user/user.service';
import { SignInRequestDto } from '../dto/sign-in.dto';
import { SignUpRequestDto } from '../dto/sign-up.dto';
import { UserEntity } from 'src/modules/user/entites/user.entity';
import { TokenData } from '../type/token-data.type';

@Injectable()
export class AuthService {
  private pepper: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {
    this.pepper = this.configService.getOrThrow('JWT_SECRET');
  }

  async signIn(dto: SignInRequestDto): Promise<ICommandResponse<TokenData>> {
    const user = await this.validateUser({
      email: dto.email,
      password: dto.password,
    });

    if (!user) {
      return {
        isSuccess: false,
        code: ERRORS.INCORRECT_CREDENTIALS.code,
        message: ERRORS.INCORRECT_CREDENTIALS.message,
      };
    }

    const tokenRes = await this.tokenService.createTokensForUser(user.id);

    if (!tokenRes.isSuccess) {
      return {
        isSuccess: false,
        code: ERRORS.TOKEN_GENERATION_FAILED.code,
        message: ERRORS.TOKEN_GENERATION_FAILED.message,
      };
    }

    return {
      isSuccess: true,
      data: tokenRes.data,
    };
  }

  async signUp(dto: SignUpRequestDto): Promise<ICommandResponse<UserEntity>> {
    const isUserExist = await this.userService.findByEmail(dto.email);

    if (isUserExist.isSuccess) {
      return {
        isSuccess: false,
        code: ERRORS.USER_ALREADY_EXISTS.code,
        message: ERRORS.USER_ALREADY_EXISTS.message,
      };
    }

    const userEntity = await new UserEntity({
      email: dto.email,
    }).setPassword(dto.password, this.pepper);

    const userRes = await this.userService.create(userEntity);

    if (!userRes.isSuccess) {
      return {
        isSuccess: false,
        code: userRes.code,
        message: userRes.message,
      };
    }

    return {
      isSuccess: true,
      data: userRes.data,
    };
  }

  async logout(deviceId: string): Promise<ICommandResponse> {
    const deleteTokenRes = await this.tokenService.deleteToken(deviceId);

    if (deleteTokenRes.isSuccess) {
      return {
        isSuccess: true,
        data: null,
      };
    }

    if (deleteTokenRes.code === ERRORS.TOKEN_NOT_FOUND.code) {
      return {
        isSuccess: false,
        code: deleteTokenRes.code,
        message: deleteTokenRes.message,
      };
    }

    return {
      isSuccess: false,
      code: ERRORS.LOGOUT_FAILED.code,
      message: ERRORS.LOGOUT_FAILED.message,
    };
  }

  private async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserEntity | null> {
    const userRes = await this.userService.findByEmail(email);

    if (!userRes.isSuccess) {
      return null;
    }

    const user = userRes.data;

    const isPasswordValid = await user.validatePassword(password, this.pepper);

    return isPasswordValid ? user : null;
  }
}
