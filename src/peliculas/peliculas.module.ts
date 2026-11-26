import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { Pelicula } from './entities/pelicula.entity';
import { Genero } from '../generos/entities/genero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula, Genero])],
  controllers: [PeliculasController],
  providers: [PeliculasService],
})
export class PeliculasModule {}
