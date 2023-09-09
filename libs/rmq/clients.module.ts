import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
  ],
  providers: [],
  exports: [],
})
export class ClientsModule {
  static register(token: string): DynamicModule {
    const providers = [
      {
        provide: token,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('RMQ_USER');
          const PASSWORD = configService.get('RMQ_PASSWORD');
          const HOST = configService.get(`RMQ_${token}_HOST`);
          const PORT = configService.get(`RMQ_${token}_PORT`);
          const QUEUE = configService.get(`RMQ_${token}_QUEUE`);

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}:${PORT}/`],
              queue: QUEUE,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
      },
    ];

    return {
      module: ClientsModule,
      providers,
      exports: providers,
    };
  }
}
