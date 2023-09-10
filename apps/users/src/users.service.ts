import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemUserEntity } from '../../../libs/entities/users/system-user.entity';
import { DataSource, Repository } from 'typeorm';
import { ClientUserEntity } from '../../../libs/entities/users/client-user.entity';
import { CreateClientUserDto } from '../../../libs/dto/users/client-users/create-client-user.dto';
import { ChangeClientUserRole } from '../../../libs/dto/users/client-users/change-client-user-role';
import { ClientUserRolesEnum } from '../../../libs/enums/client-user-roles.enum';
import { CreateSystemUserDto } from '../../../libs/dto/users/system-users/create-system-user.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateClientUserDto } from '../../../libs/dto/users/client-users/update-client-user.dto';
import { AllUsersDto } from '../../../libs/dto/users/all-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(SystemUserEntity)
    private readonly systemUserRepository: Repository<SystemUserEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
    private dataSource: DataSource,
  ) {}
  async getUserByEmail(email: string): Promise<SystemUserEntity | ClientUserEntity> {
    const clientUser = await this.clientUserRepository.findOne({
      where: {
        email: email,
      },
    });
    if (clientUser) return clientUser;
    const systemUser = await this.systemUserRepository.findOne({
      where: {
        email: email,
      },
    });
    if (systemUser) return systemUser;
  }

  async saveUser(data: CreateClientUserDto): Promise<ClientUserEntity> {
    try {
      const savedUser = await this.clientUserRepository.save(data);
      return savedUser;
    } catch {
      throw new RpcException({ message: 'User with this email already exists', status: HttpStatus.BAD_REQUEST });
    }
  }

  async changeUserRole(data: ChangeClientUserRole): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      if (data.role === ClientUserRolesEnum.EDITOR) {
        await queryRunner.manager.update(ClientUserEntity, data.id, { ...data, mayPublish: true });
      } else {
        await queryRunner.manager.update(ClientUserEntity, data.id, data);
      }
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async saveSystemUser(data: CreateSystemUserDto): Promise<SystemUserEntity> {
    try {
      const savedUser = await this.systemUserRepository.save(data);
      return savedUser;
    } catch {
      throw new RpcException({
        message: 'System user with this email/name already exists',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async updateUser(data: UpdateClientUserDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(ClientUserEntity, data.id, data);
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getAllClientUsers(): Promise<AllUsersDto> {
    const data: AllUsersDto = {
      usersAuthors: await this.getClientUsersByRole(ClientUserRolesEnum.AUTHOR),
      usersEditors: await this.getClientUsersByRole(ClientUserRolesEnum.EDITOR),
    };
    return data;
  }

  async getClientUsersByRole(role: ClientUserRolesEnum): Promise<ClientUserEntity[]> {
    const users = await this.clientUserRepository.find({
      where: {
        role: role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
    return users;
  }
}
