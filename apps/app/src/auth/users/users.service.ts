import { GatewayTimeoutException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, defaultIfEmpty, firstValueFrom, throwError, timeout } from 'rxjs';
import { ChangeClientUserRole } from '../../../../../libs/dto/users/client-users/change-client-user-role';
import { UpdateClientUserDto } from '../../../../../libs/dto/users/client-users/update-client-user.dto';
import { ChangePasswordDto } from '../../../../../libs/dto/users/change-password.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS') private readonly client: ClientProxy, private readonly authService: AuthService) {}

  async sendMessage(pattern: { cmd: string }, payload: any): Promise<any> {
    return await firstValueFrom(
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
  }

  async emitEvent(pattern: { cmd: string }, data: any): Promise<void> {
    await this.client.emit(pattern, data);
  }

  changeUserRole(data: ChangeClientUserRole) {
    const pattern = { cmd: 'changeUserRole' };
    return this.emitEvent(pattern, data);
  }

  async updateUser(data: UpdateClientUserDto, req: Request) {
    if (req.hasOwnProperty('sameUser')) {
      if (req['sameUser'] === true) data = { id: data.id, password: data.password } as ChangePasswordDto;
    }
    if (data.password) {
      data.password = await this.authService.hashPassword(data.password);
    }
    const pattern = { cmd: 'updateUser' };
    await this.emitEvent(pattern, data);
  }

  async getAllClientUsers() {
    const pattern = { cmd: 'getAllClientUsers' };
    return await this.sendMessage(pattern, '');
  }
}
