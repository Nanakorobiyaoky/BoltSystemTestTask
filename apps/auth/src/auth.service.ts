import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateClientUserDto } from '../../../libs/dto/users/client-users/create-client-user.dto';
import { SigninDto } from '../../../libs/dto/users/signin.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, defaultIfEmpty, firstValueFrom, throwError } from 'rxjs';
import { SystemUserEntity } from '../../../libs/entities/users/system-user.entity';
import { ClientUserEntity } from '../../../libs/entities/users/client-user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateSystemUserDto } from '../../../libs/dto/users/system-users/create-system-user.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS') private readonly usersClient: ClientProxy, private readonly jwtService: JwtService) {}
  async signup(data: CreateClientUserDto): Promise<{ token: string }> {
    const user = await this.getUserByEmail(data.email);
    if (user) {
      throw new RpcException({ message: 'User with this email already exists', status: HttpStatus.BAD_REQUEST });
    }
    data.password = await this.hashPassword(data.password);
    const createdUser = await this.saveUser(data);
    return this.generateJwtToken(createdUser);
  }

  async signin(data: SigninDto): Promise<{ token: string }> {
    const user = await this.getUserByEmail(data.email);
    if (!user) {
      throw new RpcException({ message: 'User with this email does not exist', status: HttpStatus.BAD_REQUEST });
    }
    if (await bcrypt.compare(data.password, user.password)) {
      return this.generateJwtToken(user);
    }
    throw new RpcException({ message: 'Incorrect password', status: HttpStatus.BAD_REQUEST });
  }

  async signupSystemUser(data: CreateSystemUserDto): Promise<{ token: string }> {
    const user = await this.getUserByEmail(data.email);
    if (user) {
      throw new RpcException({ message: 'User with this email already exists', status: HttpStatus.BAD_REQUEST });
    }
    data.password = await this.hashPassword(data.password);
    const createdUser = await this.saveSystemUser(data);
    return this.generateJwtToken(createdUser);
  }

  private async getUserByEmail(email: string): Promise<SystemUserEntity | ClientUserEntity | null> {
    const pattern = { cmd: 'getUserByEmail' };
    const user = await this.sendMessage(pattern, email);
    return user;
  }

  private async saveUser(data: CreateClientUserDto): Promise<ClientUserEntity> {
    const pattern = { cmd: 'saveUser' };
    const savedUser = await this.sendMessage(pattern, data);
    return savedUser;
  }

  private async saveSystemUser(data: CreateSystemUserDto): Promise<SystemUserEntity> {
    const pattern = { cmd: 'saveSystemUser' };
    const savedUser = await this.sendMessage(pattern, data);
    return savedUser;
  }

  private generateJwtToken(user: ClientUserEntity | SystemUserEntity): { token: string } {
    return {
      token: this.jwtService.sign(user),
    };
  }

  private async sendMessage(pattern, data) {
    const response = await firstValueFrom(
      this.usersClient.send(pattern, data).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
        defaultIfEmpty(null),
      ),
    );
    return response;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 5);
  }
}
