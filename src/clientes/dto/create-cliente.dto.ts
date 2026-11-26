import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombres del cliente', example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ description: 'Apellido paterno', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  paterno: string;

  @ApiPropertyOptional({ description: 'Apellido materno', example: 'Gómez' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  materno?: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan.perez@email.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;
}
