import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { ClientsModule } from '../../../../libs/rmq/clients.module';
import { GetAuthorIdMiddleware } from '../../../../libs/middlewares/get-author-id.middleware';
import { GetPublicationsMiddleware } from '../../../../libs/middlewares/get-publications.middleware';

@Module({
  imports: [ClientsModule.register('PUBLICATIONS')],
  providers: [PublicationsService],
  controllers: [PublicationsController],
})
export class PublicationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetAuthorIdMiddleware).forRoutes({ path: 'publications', method: RequestMethod.POST });
    consumer
      .apply(GetPublicationsMiddleware)
      .forRoutes(
        { path: 'publications', method: RequestMethod.GET },
        { path: 'publications/*', method: RequestMethod.GET },
      );
  }
}
