import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { Genero } from '../generos/entities/genero.entity';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { AsignarGenerosDto } from './dto/asignar-generos.dto';

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  async create(createPeliculaDto: CreatePeliculaDto) {
    const { idGeneros, ...datos } = createPeliculaDto;
    const generos = idGeneros?.length ? await this.buscarGeneros(idGeneros) : [];

    const pelicula = this.peliculaRepository.create({ ...datos, generos });
    const guardada = await this.peliculaRepository.save(pelicula);
    return this.findOne(guardada.idPelicula);
  }

  findAll() {
    return this.peliculaRepository.find({
      relations: { generos: true },
      order: { idPelicula: 'ASC' },
    });
  }

  async findOne(id: number) {
    const pelicula = await this.peliculaRepository.findOne({
      where: { idPelicula: id },
      relations: { generos: true, funciones: true },
    });
    if (!pelicula) {
      throw new NotFoundException(`La película con id ${id} no existe`);
    }
    return pelicula;
  }

  async update(id: number, updatePeliculaDto: UpdatePeliculaDto) {
    const pelicula = await this.buscarConGeneros(id);
    const { idGeneros, ...datos } = updatePeliculaDto;

    if (idGeneros !== undefined) {
      pelicula.generos = idGeneros.length ? await this.buscarGeneros(idGeneros) : [];
    }
    Object.assign(pelicula, datos);

    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  async remove(id: number) {
    const pelicula = await this.peliculaRepository.findOneBy({ idPelicula: id });
    if (!pelicula) {
      throw new NotFoundException(`La película con id ${id} no existe`);
    }
    await this.peliculaRepository.softDelete(id); // borrado lógico
    return { mensaje: `La película con id ${id} fue eliminada` };
  }

  /** POST /peliculas/:id/generos -> agrega géneros sin quitar los que ya tiene */
  async asignarGeneros(id: number, asignarGenerosDto: AsignarGenerosDto) {
    const pelicula = await this.buscarConGeneros(id);
    const nuevos = await this.buscarGeneros(asignarGenerosDto.idGeneros);

    const generos = new Map(pelicula.generos.map((g) => [g.idGenero, g]));
    nuevos.forEach((g) => generos.set(g.idGenero, g));
    pelicula.generos = [...generos.values()];

    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  /** DELETE /peliculas/:id/generos/:idGenero -> quita un género de la película */
  async quitarGenero(id: number, idGenero: number) {
    const pelicula = await this.buscarConGeneros(id);

    const existeGenero = await this.generoRepository.existsBy({ idGenero });
    if (!existeGenero) {
      throw new NotFoundException(`El género con id ${idGenero} no existe`);
    }
    if (!pelicula.generos.some((g) => g.idGenero === idGenero)) {
      throw new NotFoundException(
        `La película con id ${id} no tiene asignado el género con id ${idGenero}`,
      );
    }

    pelicula.generos = pelicula.generos.filter((g) => g.idGenero !== idGenero);
    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  private async buscarConGeneros(id: number) {
    const pelicula = await this.peliculaRepository.findOne({
      where: { idPelicula: id },
      relations: { generos: true },
    });
    if (!pelicula) {
      throw new NotFoundException(`La película con id ${id} no existe`);
    }
    return pelicula;
  }

  /** Devuelve los géneros pedidos; si alguno no existe lanza NotFoundException */
  private async buscarGeneros(ids: number[]) {
    const unicos = [...new Set(ids)];
    const generos = await this.generoRepository.findBy({ idGenero: In(unicos) });

    const encontrados = new Set(generos.map((g) => g.idGenero));
    const faltantes = unicos.filter((id) => !encontrados.has(id));
    if (faltantes.length === 1) {
      throw new NotFoundException(`El género con id ${faltantes[0]} no existe`);
    }
    if (faltantes.length > 1) {
      throw new NotFoundException(`Los géneros con id ${faltantes.join(', ')} no existen`);
    }
    return generos;
  }
}
