import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGeneroDto {
  @ApiProperty({ description: 'Nombre del género', example: 'Acción' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción del género', example: 'Películas con mucha acción' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
