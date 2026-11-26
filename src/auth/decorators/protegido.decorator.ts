import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

/**
 * Protege un endpoint con JWT (se usa en los POST, PATCH y DELETE).
 * También lo documenta en Scalar con el candado de Bearer y la respuesta 401.
 */
export const Protegido = () =>
  applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Token no enviado, inválido o expirado' }),
  );
