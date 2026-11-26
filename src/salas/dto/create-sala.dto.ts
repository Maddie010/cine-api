import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({ description: 'Nombre de la sala', example: 'Sala 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Cantidad de asientos de la sala', example: 50, minimum: 1 })
  @IsInt()
  @Min(1)
  capacidad: number;

  @ApiProperty({ description: 'Tipo de sala', enum: ['2D', '3D', 'IMAX'], example: '2D' })
  @IsString()
  @IsIn(['2D', '3D', 'IMAX'])
  tipo: string;
}
