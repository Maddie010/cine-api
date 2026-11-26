import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico', example: 'admin@cine.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contraseña', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
