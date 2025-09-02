import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';

        // Handle HTTP exceptions
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            
            if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || exception.message;
                error = (exceptionResponse as any).error || exception.name;
            } else {
                message = exceptionResponse;
                error = exception.name;
            }
        }
        // Handle Prisma exceptions
        else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            status = HttpStatus.BAD_REQUEST;
            
            switch (exception.code) {
                case 'P2002':
                    message = 'Bu ma\'lumot allaqachon mavjud';
                    error = 'Unique Constraint Violation';
                    break;
                case 'P2025':
                    message = 'Ma\'lumot topilmadi';
                    error = 'Record Not Found';
                    status = HttpStatus.NOT_FOUND;
                    break;
                case 'P2003':
                    message = 'Bog\'liq ma\'lumot topilmadi';
                    error = 'Foreign Key Constraint';
                    break;
                default:
                    message = 'Ma\'lumotlar bazasi xatosi';
                    error = 'Database Error';
            }
        }
        // Handle validation errors
        else if (exception instanceof Error) {
            if (exception.message.includes('validation')) {
                status = HttpStatus.BAD_REQUEST;
                error = 'Validation Error';
            }
            message = exception.message;
        }

        // Log the error
        this.logger.error(
            `${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : exception,
        );

        // Send error response
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        });
    }
}
