import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';
import { ImageExtensionsEnum } from '../../../../../libs/enums/image-extensions.enum';

@Injectable()
export class FilesService {

  staticFilepath = path.resolve(__dirname, '..', 'static')

  async saveImage(image, filename): Promise<string> {

    try {
      if (!fs.existsSync(this.staticFilepath)) {
        fs.mkdirSync(this.staticFilepath, { recursive: true });
      }
      await fs.writeFile(path.join(this.staticFilepath, filename), image.buffer, (err) => {
        console.error(err)
        // if (err) throw err;
      });
      return filename;
    } catch (err) {
      throw new InternalServerErrorException('error while writing file');
    }
  }

  createImageName(image): string {
    const fileExtension = image.originalname.split('.').at(-1);
    const requiredExtensions = Object.values(ImageExtensionsEnum);
    if (!requiredExtensions.includes(fileExtension)) {
      throw new BadRequestException('invalid file extension');
    }
    return uuid.v4() + '.' + fileExtension;
  }

  deleteImage(filename: string): void {
    fs.unlink(path.join(this.staticFilepath, filename), (err) => {
      if (err) {
        console.error(err)
      }
    })
  }
}
