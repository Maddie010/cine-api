import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un usuario',
    description: 'Crea un usuario del personal del cine. La contraseña se guarda encriptada con bcrypt.',
  })
  @ApiCreatedResponse({ description: 'Usuario registrado correctamente (sin la contraseña)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos (email mal formado, contraseña muy corta, etc.)' })
  @ApiConflictResponse({ description: 'El correo ya está registrado' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Valida las credenciales y devuelve un access_token (JWT). Úselo en el botón de autenticación Bearer para probar los endpoints protegidos (POST, PATCH y DELETE).',
  })
  @ApiOkResponse({
    description: 'Inicio de sesión correcto',
    schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'Correo o contraseña incorrectos' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
