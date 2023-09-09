import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
