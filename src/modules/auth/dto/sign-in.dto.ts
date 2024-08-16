import { UserSignInContractCommand } from 'libs/contracts/commands';
import { createZodDto } from 'nestjs-zod';

export class SignInRequestDto extends createZodDto(
  UserSignInContractCommand.RequestSchema,
) {}

export class SignInResponseDto extends createZodDto(
  UserSignInContractCommand.ResponseSchema,
) {}
