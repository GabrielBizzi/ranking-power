import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { NotFoundError } from '../types/not-found-error.type';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof NotFoundError) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: error.message,
            },
            HttpStatus.NOT_FOUND,
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
