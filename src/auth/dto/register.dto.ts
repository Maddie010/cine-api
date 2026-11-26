import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nombre de usuario', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @ApiProperty({ description: 'Correo electrónico (único)', example: 'admin@cine.com' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ description: 'Contraseña (mínimo 6 caracteres)', example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
