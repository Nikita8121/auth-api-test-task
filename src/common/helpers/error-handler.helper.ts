import { InternalServerErrorException } from '@nestjs/common';
import { ICommandResponse } from '../interface/command-response.type';
import { ERRORS } from 'libs/contracts/constant';
import { HttpExceptionWithErrorCodeType } from '../exception/http-exeception-with-error-code.type';

export function errorHandler<T>(response: ICommandResponse<T>): T {
  if (response.isSuccess) {
    if (!response.data) {
      throw new InternalServerErrorException('No data returned');
    }
    return response.data;
  } else {
    if (!response.code) {
      throw new InternalServerErrorException('Unknown error');
    }
    const errorObject = Object.values(ERRORS).find(
      (error) => error.code === response.code,
    );

    if (!errorObject) {
      throw new InternalServerErrorException('Unknown error');
    }
    throw new HttpExceptionWithErrorCodeType(
      errorObject.message,
      errorObject.code,
      errorObject.httpCode,
      response.data,
    );
  }
}

export function errorHandlerWithNull<T>(
  response: ICommandResponse<T>,
): T | null {
  if (response.isSuccess) {
    if (!response.data) {
      return null;
    }
    return errorHandler(response);
  } else {
    return errorHandler(response);
  }
}
