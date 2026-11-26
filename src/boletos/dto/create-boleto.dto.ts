import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBoletoDto {
  @ApiProperty({ description: 'Id de la función (debe existir)', example: 1 })
  @IsInt()
  idFuncion: number;

  @ApiProperty({ description: 'Id del cliente que compra el boleto (debe existir)', example: 1 })
  @IsInt()
  idCliente: number;

  @ApiProperty({
    description: 'Número de asiento (entre 1 y la capacidad de la sala). No puede repetirse en la misma función',
    example: 12,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  numeroAsiento: number;

  @ApiPropertyOptional({
    description: 'Precio pagado. Si no se envía, se guarda el precio de la función',
    example: 35.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPagado?: number;
}
