import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

/**
 * Guard que valida el token JWT enviado en el header:
 *   Authorization: Bearer <access_token>
 * Si no se envía o no es válido responde 401 (UnauthorizedException).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { usuario?: unknown }>();
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Token no enviado. Use el header Authorization: Bearer <access_token>',
      );
    }

    try {
      request.usuario = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('El token es inválido o ha expirado');
    }
    return true;
  }
}
