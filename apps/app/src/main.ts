import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const config = app.get(ConfigService);
  const PORT = config.get('APP_PORT');
  const MODE = config.get('NODE_ENV');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Сервис публикаций')
    .setDescription('Тестовое задание для Bolt-System')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
    console.log(`mode: ${MODE}`);
    console.log(`Swagger doc path: localhost:${PORT}/doc`);
  });
}
bootstrap();
