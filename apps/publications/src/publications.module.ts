import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationEntity } from '../../../libs/entities/publications/publication.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forFeature([PublicationEntity]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('MYSQL_PUBLICATIONS_HOST'),
          port: +configService.get('MYSQL_PUBLICATIONS_PORT'),
          username: configService.get('MYSQL_PUBLICATIONS_USERNAME'),
          password: configService.get('MYSQL_PUBLICATIONS_PASSWORD'),
          database: configService.get('MYSQL_PUBLICATIONS_DATABASE'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
