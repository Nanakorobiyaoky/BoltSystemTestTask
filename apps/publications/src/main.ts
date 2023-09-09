import { NestFactory } from '@nestjs/core';
import { PublicationsModule } from './publications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PublicationsModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RMQ_USER');
  const PASSWORD = configService.get('RMQ_PASSWORD');
  const HOST = configService.get('RMQ_PUBLICATIONS_HOST');
  const PORT = configService.get('RMQ_PUBLICATIONS_PORT');
  const QUEUE = configService.get('RMQ_PUBLICATIONS_QUEUE');

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
