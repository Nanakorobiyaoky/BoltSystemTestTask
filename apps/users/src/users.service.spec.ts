import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ClientUserEntity } from '../../../libs/entities/users/client-user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateClientUserDto } from '../../../libs/dto/users/client-users/create-client-user.dto';
import { SystemUserEntity } from '../../../libs/entities/users/system-user.entity';
import { UsersModule } from './users.module';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { CreateSystemUserDto } from '../../../libs/dto/users/system-users/create-system-user.dto';
import { Repository } from 'typeorm';
import { ClientUserRolesEnum } from '../../../libs/enums/client-user-roles.enum';

const userDto: CreateClientUserDto = {
  email: 'test@example.com',
  fullName: 'test',
  password: 'password',
};
const adminDto: CreateSystemUserDto = {
  email: 'adminTest@example.com',
  name: 'adminTest',
  password: 'password',
};

describe('UsersService', () => {
  let usersService: UsersService;
  let clientUsersRepository: Repository<ClientUserEntity>;
  let systemUsersRepository: Repository<ClientUserEntity>;

  afterAll(async () => {
    await clientUsersRepository.delete({ email: userDto.email });
    await systemUsersRepository.delete({ email: adminDto.email });
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(ClientUserEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(SystemUserEntity),
          useValue: {},
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    clientUsersRepository = module.get<Repository<ClientUserEntity>>(getRepositoryToken(ClientUserEntity));
    systemUsersRepository = module.get<Repository<ClientUserEntity>>(getRepositoryToken(SystemUserEntity));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create Author', () => {
    it('should create a new user', async () => {
      const result = await usersService.saveUser(userDto);
      expect(result.id.length).toEqual(36);
      expect(result.email).toEqual(userDto.email);
      expect(result.fullName).toEqual(userDto.fullName);
      expect(result.password).toEqual(userDto.password);
    });

    it('should throw Exception', async () => {
      await expect(
        usersService.saveUser({ email: 'author@gmail.com', fullName: 'author', password: 'author' }),
      ).rejects.toThrowError(
        new RpcException({ message: 'User with this email already exists', status: HttpStatus.BAD_REQUEST }),
      );
    });
  });

  describe('create Admin', () => {
    it('should create a new system user', async () => {
      const result = await usersService.saveSystemUser(adminDto);
      expect(result.id.length).toEqual(36);
      expect(result.email).toEqual(adminDto.email);
      expect(result.name).toEqual(adminDto.name);
      expect(result.password).toEqual(adminDto.password);
    });

    it('should throw Exception', async () => {
      await expect(
        usersService.saveSystemUser({ email: 'admin', name: 'admin', password: 'admin' }),
      ).rejects.toThrowError(
        new RpcException({
          message: 'System user with this email/name already exists',
          status: HttpStatus.BAD_REQUEST,
        }),
      );
    });
  });

  describe('get user by email ', () => {
    it('should return admin', async () => {
      const result = await usersService.getUserByEmail('admin');
      expect(result.id.length).toEqual(36);
      expect(result.email).toEqual('admin');
      expect(result.role).toEqual('admin');
    });

    it('should return author', async () => {
      const result = await usersService.getUserByEmail('author@gmail.com');
      expect(result.id.length).toEqual(36);
      expect(result.email).toEqual('author@gmail.com');
      expect(result.role).toEqual('author');
    });

    it('should return editor', async () => {
      const result = await usersService.getUserByEmail('editor@gmail.com');
      expect(result.id.length).toEqual(36);
      expect(result.email).toEqual('editor@gmail.com');
      expect(result.role).toEqual('editor');
    });

    it('should be undefined', async () => {
      const result = await usersService.getUserByEmail('email');
      expect(result).toBe(undefined);
    });
  });

  describe('update author', () => {
    it('should change role', async () => {
      const user = await usersService.getUserByEmail('author@gmail.com');
      expect(user.role).toEqual(ClientUserRolesEnum.AUTHOR);
      await usersService.changeUserRole({ id: user.id, role: ClientUserRolesEnum.EDITOR });
      const changedUser = await usersService.getUserByEmail('author@gmail.com');
      expect(changedUser.role).toEqual(ClientUserRolesEnum.EDITOR);
      await usersService.changeUserRole({ id: user.id, role: ClientUserRolesEnum.AUTHOR });
      expect(user.role).toEqual(ClientUserRolesEnum.AUTHOR);
    });
  });

  describe('get all Client users', () => {
    it('should return AllUsersDto', async () => {
      const result = await usersService.getAllClientUsers();
      for (const user of result.usersEditors) {
        expect(user instanceof ClientUserEntity).toBe(true);
      }
      for (const user of result.usersAuthors) {
        expect(user instanceof ClientUserEntity).toBe(true);
      }
    });

    it('should return array of Authors', async () => {
      const result = await usersService.getClientUsersByRole(ClientUserRolesEnum.AUTHOR);
      for (const user of result) {
        expect(user instanceof ClientUserEntity).toBe(true);
        expect(user.role).toBe(ClientUserRolesEnum.AUTHOR);
      }
    });

    it('should return array of Editors', async () => {
      const result = await usersService.getClientUsersByRole(ClientUserRolesEnum.EDITOR);
      for (const user of result) {
        expect(user instanceof ClientUserEntity).toBe(true);
        expect(user.role).toBe(ClientUserRolesEnum.EDITOR);
      }
    });
  });

  describe('update user', () => {
    it('should update user data', async () => {
      const user = (await usersService.getUserByEmail('author@gmail.com')) as ClientUserEntity;
      const data = { id: user.id, fullName: 'new full name' };
      await usersService.updateUser(data);
      const updatedUser1 = (await usersService.getUserByEmail('author@gmail.com')) as ClientUserEntity;
      expect(updatedUser1.fullName).toEqual('new full name');
      await usersService.updateUser({ id: user.id, fullName: user.fullName });
      const updatedUser2 = (await usersService.getUserByEmail('author@gmail.com')) as ClientUserEntity;
      expect(updatedUser2.fullName).toEqual('author');
    });
  });
});
