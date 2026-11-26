import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Valida los DTOs con class-validator y elimina los campos que no están en el DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Documentación con Scalar -> http://localhost:3000/reference
  const config = new DocumentBuilder()
    .setTitle('API Cine')
    .setDescription(
      'Sistema de Gestión de Cine - TAW-251. Los endpoints POST, PATCH y DELETE requieren un token JWT: ' +
        'regístrese en /auth/register, inicie sesión en /auth/login y use el access_token en la autenticación Bearer.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use('/reference', apiReference({ content: document }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`API:      http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Scalar:   http://localhost:${process.env.PORT ?? 3000}/reference`);
}
bootstrap();
