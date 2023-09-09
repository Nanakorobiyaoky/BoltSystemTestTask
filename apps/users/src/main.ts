import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RMQ_USER');
  const PASSWORD = configService.get('RMQ_PASSWORD');
  const HOST = configService.get('RMQ_USERS_HOST');
  const PORT = configService.get('RMQ_USERS_PORT');
  const QUEUE = configService.get('RMQ_USERS_QUEUE');

  const publications = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}:${PORT}/`],
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await publications.listen();
}
bootstrap();
