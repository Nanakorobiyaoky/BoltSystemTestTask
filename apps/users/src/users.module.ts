import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUserEntity } from '../../../libs/entities/users/system-user.entity';
import { ClientUserEntity } from '../../../libs/entities/users/client-user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forFeature([SystemUserEntity, ClientUserEntity]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('MYSQL_USERS_HOST'),
          port: +configService.get('MYSQL_USERS_PORT'),
          username: configService.get('MYSQL_USERS_USERNAME'),
          password: configService.get('MYSQL_USERS_PASSWORD'),
          database: configService.get('MYSQL_USERS_DATABASE'),
          autoLoadEntities: true,
          logging: false,
          synchronize: false,
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
