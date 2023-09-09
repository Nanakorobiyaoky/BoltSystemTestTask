import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicationsModule } from './publications/publications.module';
import * as process from 'process';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    PublicationsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
