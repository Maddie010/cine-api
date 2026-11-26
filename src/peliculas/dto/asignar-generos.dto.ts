import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AsignarGenerosDto {
  @ApiProperty({
    description: 'Ids de los géneros que se asignan a la película (todos deben existir)',
    type: [Number],
    example: [1, 2],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  idGeneros: number[];
}
