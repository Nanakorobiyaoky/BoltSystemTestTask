import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { ClientsModule } from '../../../../libs/rmq/clients.module';
import { GetPublicationsMiddleware } from '../../../../libs/middlewares/get-publications.middleware';
import { FilesModule } from './files/files.module';

@Module({
  imports: [ClientsModule.register('PUBLICATIONS'), FilesModule],
  providers: [PublicationsService],
  controllers: [PublicationsController],
})
export class PublicationsModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(GetAuthorIdMiddleware).forRoutes({ path: 'publications', method: RequestMethod.POST });
    consumer
      .apply(GetPublicationsMiddleware)
      .forRoutes(
        { path: 'publications', method: RequestMethod.GET },
        { path: 'publications/*', method: RequestMethod.GET },
      );
  }
}
