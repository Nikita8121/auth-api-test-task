import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserSessionInfo } from 'src/common/decorators/user.decorator';
import { JwtPayload } from '../auth/type/jwtPlayload.type';
import { GetUserInfoContractQuery } from 'libs/contracts/commands/user';
import { errorHandler } from 'src/common/helpers/error-handler.helper';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(
    @UserSessionInfo() session: JwtPayload,
  ): Promise<GetUserInfoContractQuery.Response> {
    const res = await this.userService.findUserById(session.userId);

    const data = errorHandler(res);

    return {
      data: {
        email: data.email,
      },
    };
  }
}
