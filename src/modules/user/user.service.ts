import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserCreatePayload } from './types';
import { ICommandResponse } from 'src/common/interface/command-response.type';
import { UserEntity } from './entites/user.entity';
import { ERRORS } from 'libs/contracts';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(
    payload: UserCreatePayload,
  ): Promise<ICommandResponse<UserEntity>> {
    try {
      const user = new UserEntity(payload);

      const createdUser = await this.userRepository.create(user);

      return {
        isSuccess: true,
        data: createdUser,
      };
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      return {
        isSuccess: false,
        code: ERRORS.USER_CREATE_FAILED.code,
        message: ERRORS.USER_CREATE_FAILED.message,
      };
    }
  }

  async findByEmail(email: string): Promise<ICommandResponse<UserEntity>> {
    try {
      const [user] = await this.userRepository.findByCriteria({ email });

      if (!user) {
        this.logger.error(`User not found by email: ${email}`);
        return {
          isSuccess: false,
          code: ERRORS.USER_NOT_FOUND.code,
          message: ERRORS.USER_NOT_FOUND.message,
        };
      }

      return {
        isSuccess: true,
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${error}`);
      return {
        isSuccess: false,
        code: ERRORS.USER_NOT_FOUND.code,
        message: ERRORS.USER_NOT_FOUND.message,
      };
    }
  }

  async findUserById(id: number): Promise<ICommandResponse<UserEntity>> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        this.logger.log(`User not found by id: ${id}`);
        return {
          isSuccess: false,
          code: ERRORS.USER_NOT_FOUND.code,
          message: ERRORS.USER_NOT_FOUND.message,
        };
      }

      return {
        isSuccess: true,
        data: user,
      };
    } catch (error) {
      this.logger.error(`Failed to find user by id: ${error}`);
      return {
        isSuccess: false,
        code: ERRORS.USER_NOT_FOUND.code,
        message: ERRORS.USER_NOT_FOUND.message,
      };
    }
  }
}
