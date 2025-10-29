import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { UnauthorizedError } from '../types/unauthorized-error.type';

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof UnauthorizedError) {
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              error: 'Loga caraio',
            },
            HttpStatus.UNAUTHORIZED,
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
