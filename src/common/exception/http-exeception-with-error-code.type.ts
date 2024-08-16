import { HttpException } from '@nestjs/common/exceptions/http.exception';

export class HttpExceptionWithErrorCodeType extends HttpException {
    errorCode: string;
    data?: unknown;

    constructor(message: string, errorCode: string, statusCode: number, data?: unknown) {
        super(message, statusCode);
        this.errorCode = errorCode;
        this.data = data;
    }
}
