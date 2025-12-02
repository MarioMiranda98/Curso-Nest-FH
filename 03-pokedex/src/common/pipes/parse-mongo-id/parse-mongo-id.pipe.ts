import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const isValidMongoId = isValidObjectId(value);

    if (!isValidMongoId) {
      throw new BadRequestException('Invalid id');
    }

    return value;
  }
}
