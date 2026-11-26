import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalasModule } from './salas/salas.module';
import { GenerosModule } from './generos/generos.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { FuncionesModule } from './funciones/funciones.module';
import { ClientesModule } from './clientes/clientes.module';
import { BoletosModule } from './boletos/boletos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // crea/actualiza las tablas a partir de las entidades (solo para desarrollo)
      }),
    }),
    SalasModule,
    GenerosModule,
    PeliculasModule,
    FuncionesModule,
    ClientesModule,
    BoletosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
