import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletosService } from './boletos.service';
import { BoletosController } from './boletos.controller';
import { Boleto } from './entities/boleto.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Funcion, Cliente])],
  controllers: [BoletosController],
  providers: [BoletosService],
})
export class BoletosModule {}
