import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionesService } from './funciones.service';
import { FuncionesController } from './funciones.controller';
import { Funcion } from './entities/funcion.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Boleto } from '../boletos/entities/boleto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funcion, Sala, Pelicula, Boleto])],
  controllers: [FuncionesController],
  providers: [FuncionesService],
})
export class FuncionesModule {}
