import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcion } from './entities/funcion.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Boleto } from '../boletos/entities/boleto.entity';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';

@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion)
    private readonly funcionRepository: Repository<Funcion>,
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
  ) {}

  async create(createFuncionDto: CreateFuncionDto) {
    await this.buscarSala(createFuncionDto.idSala);
    await this.buscarPelicula(createFuncionDto.idPelicula);

    const funcion = this.funcionRepository.create({
      ...createFuncionDto,
      fechaHora: new Date(createFuncionDto.fechaHora),
    });
    const guardada = await this.funcionRepository.save(funcion);
    return this.findOne(guardada.idFuncion);
  }

  findAll() {
    return this.funcionRepository.find({
      relations: { sala: true, pelicula: true },
      order: { idFuncion: 'ASC' },
    });
  }

  async findOne(id: number) {
    const funcion = await this.funcionRepository.findOne({
      where: { idFuncion: id },
      relations: { sala: true, pelicula: true, boletos: true }, // boletos vendidos
    });
    if (!funcion) {
      throw new NotFoundException(`La función con id ${id} no existe`);
    }
    return funcion;
  }

  async update(id: number, updateFuncionDto: UpdateFuncionDto) {
    const funcion = await this.funcionRepository.findOneBy({ idFuncion: id });
    if (!funcion) {
      throw new NotFoundException(`La función con id ${id} no existe`);
    }

    if (updateFuncionDto.idSala !== undefined) {
      const sala = await this.buscarSala(updateFuncionDto.idSala);
      // No se puede pasar a una sala más chica que los asientos ya vendidos
      const asientoMaximo = await this.boletoRepository.maximum('numeroAsiento', {
        idFuncion: id,
      });
      if (asientoMaximo && asientoMaximo > sala.capacidad) {
        throw new BadRequestException(
          `No se puede cambiar a la sala "${sala.nombre}" (capacidad ${sala.capacidad}) porque la función ya tiene boletos vendidos hasta el asiento ${asientoMaximo}`,
        );
      }
    }
    if (updateFuncionDto.idPelicula !== undefined) {
      await this.buscarPelicula(updateFuncionDto.idPelicula);
    }

    const { fechaHora, ...resto } = updateFuncionDto;
    Object.assign(funcion, resto);
    if (fechaHora !== undefined) {
      funcion.fechaHora = new Date(fechaHora);
    }

    await this.funcionRepository.save(funcion);
    return this.findOne(id);
  }

  async remove(id: number) {
    const funcion = await this.funcionRepository.findOneBy({ idFuncion: id });
    if (!funcion) {
      throw new NotFoundException(`La función con id ${id} no existe`);
    }
    await this.funcionRepository.softDelete(id); // borrado lógico
    return { mensaje: `La función con id ${id} fue eliminada` };
  }

  private async buscarSala(idSala: number) {
    const sala = await this.salaRepository.findOneBy({ idSala });
    if (!sala) {
      throw new NotFoundException(`La sala con id ${idSala} no existe`);
    }
    return sala;
  }

  private async buscarPelicula(idPelicula: number) {
    const pelicula = await this.peliculaRepository.findOneBy({ idPelicula });
    if (!pelicula) {
      throw new NotFoundException(`La película con id ${idPelicula} no existe`);
    }
    return pelicula;
  }
}
