import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePeliculaDto {
  @ApiProperty({ description: 'Título de la película', example: 'Misión Imposible' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiProperty({ description: 'Sinopsis de la película', example: 'Un agente secreto debe detener una amenaza global.' })
  @IsString()
  @IsNotEmpty()
  sinopsis: string;

  @ApiProperty({ description: 'Duración en minutos', example: 130, minimum: 1 })
  @IsInt()
  @Min(1)
  duracionMin: number;

  @ApiProperty({ description: 'Clasificación por edades', enum: ['ATP', '+13', '+18'], example: '+13' })
  @IsString()
  @IsIn(['ATP', '+13', '+18'])
  clasificacion: string;

  @ApiPropertyOptional({
    description: 'Ids de los géneros que se le asignan a la película (todos deben existir)',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  idGeneros?: number[];
}
