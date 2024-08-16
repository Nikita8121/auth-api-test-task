import { UserSignUpContractCommand } from 'libs/contracts';
import { createZodDto } from 'nestjs-zod';

export class SignUpRequestDto extends createZodDto(
  UserSignUpContractCommand.RequestSchema,
) {}

export class SignUpResponseDto extends createZodDto(
  UserSignUpContractCommand.ResponseSchema,
) {}
