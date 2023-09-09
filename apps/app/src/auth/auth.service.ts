import { GatewayTimeoutException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, defaultIfEmpty, firstValueFrom, throwError, timeout } from 'rxjs';
import { CreateClientUserDto } from '../../../../libs/dto/users/client-users/create-client-user.dto';
import { SigninDto } from '../../../../libs/dto/users/signin.dto';
import { CreateSystemUserDto } from '../../../../libs/dto/users/system-users/create-system-user.dto';
import { CreateEditorDto } from '../../../../libs/dto/users/client-users/create-editor.dto';
import { ClientUserRolesEnum } from '../../../../libs/enums/client-user-roles.enum';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH') private readonly authClient: ClientProxy) {}

  async sendMessage(pattern: { cmd: string }, payload: any): Promise<any> {
    return await firstValueFrom(
      this.authClient.send(pattern, payload).pipe(
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

  async hashPassword(password: string): Promise<string> {
    const hashPasswordPattern = { cmd: 'hashPassword' };
    return await this.sendMessage(hashPasswordPattern, password);
  }

  async signup(data: CreateClientUserDto) {
    const pattern = { cmd: 'signup' };
    return await this.sendMessage(pattern, data);
  }

  async signin(data: SigninDto) {
    const pattern = { cmd: 'signin' };
    return await this.sendMessage(pattern, data);
  }

  async signupSystemUser(data: CreateSystemUserDto) {
    const pattern = { cmd: 'signupSystemUser' };
    return await this.sendMessage(pattern, data);
  }

  async signupEditor(body: CreateClientUserDto) {
    const data: CreateEditorDto = { ...body, role: ClientUserRolesEnum.EDITOR, mayPublish: true };
    const pattern = { cmd: 'signup' };
    return await this.sendMessage(pattern, data);
  }
}
