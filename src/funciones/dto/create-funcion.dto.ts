import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateFuncionDto {
  @ApiProperty({ description: 'Id de la sala donde se realiza la función (debe existir)', example: 1 })
  @IsInt()
  idSala: number;

  @ApiProperty({ description: 'Id de la película que se proyecta (debe existir)', example: 1 })
  @IsInt()
  idPelicula: number;

  @ApiProperty({
    description: 'Fecha y hora de la función (formato ISO 8601)',
    example: '2026-12-15T18:30:00',
  })
  @IsDateString()
  fechaHora: string;

  @ApiProperty({ description: 'Precio de la entrada', example: 35.5, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio: number;
}
