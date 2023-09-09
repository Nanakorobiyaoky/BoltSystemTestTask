import { GatewayTimeoutException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, defaultIfEmpty, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS') private readonly client: ClientProxy) {}

  async sendMessage(pattern: { cmd: string }, payload: any): Promise<any> {
    const response = await firstValueFrom(
      this.client.send(pattern, payload).pipe(
        timeout({
          each: 5000,
          with: () => throwError(() => new GatewayTimeoutException()),
        }),
        catchError((error) => {
          return throwError(() => new HttpException(error.message, error.status));
        }),
        defaultIfEmpty(null),
      ),
    );

    return response;
  }

  async emitEvent(pattern: { cmd: string }, data: any): Promise<void> {
    await this.client.emit(pattern, data);
  }
}
