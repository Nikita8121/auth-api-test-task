import { GetFileListContractQuery } from 'libs/contracts';
import { createZodDto } from 'nestjs-zod';

export class GetFileListRequestDto extends createZodDto(
  GetFileListContractQuery.RequestSchema,
) {}

export class GetFileListResponseDto extends createZodDto(
  GetFileListContractQuery.ResponseSchema,
) {}
