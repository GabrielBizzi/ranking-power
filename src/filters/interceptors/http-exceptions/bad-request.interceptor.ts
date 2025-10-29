import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { BadRequestError } from '../types/bad-request-error.type';

@Injectable()
export class BadRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof BadRequestError) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: error.message,
            },
            HttpStatus.BAD_REQUEST,
            {
              cause: error,
            },
          );
        } else {
          throw error;
        }
      }),
    );
  }
}
