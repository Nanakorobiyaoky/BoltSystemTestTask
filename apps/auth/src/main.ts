import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RMQ_USER');
  const PASSWORD = configService.get('RMQ_PASSWORD');
  const HOST = configService.get('RMQ_AUTH_HOST');
  const PORT = configService.get('RMQ_AUTH_PORT');
  const QUEUE = configService.get('RMQ_AUTH_QUEUE');

  const auth = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}:${PORT}/`],
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await auth.listen();
}
bootstrap();
