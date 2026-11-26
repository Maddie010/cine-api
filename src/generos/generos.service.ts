import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from './entities/genero.entity';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  create(createGeneroDto: CreateGeneroDto) {
    const genero = this.generoRepository.create(createGeneroDto);
    return this.generoRepository.save(genero);
  }

  findAll() {
    return this.generoRepository.find({ order: { idGenero: 'ASC' } });
  }

  async findOne(id: number) {
    const genero = await this.generoRepository.findOne({
      where: { idGenero: id },
      relations: { peliculas: true },
    });
    if (!genero) {
      throw new NotFoundException(`El género con id ${id} no existe`);
    }
    return genero;
  }

  async update(id: number, updateGeneroDto: UpdateGeneroDto) {
    const genero = await this.generoRepository.preload({ idGenero: id, ...updateGeneroDto });
    if (!genero) {
      throw new NotFoundException(`El género con id ${id} no existe`);
    }
    await this.generoRepository.save(genero);
    return this.findOne(id);
  }

  async remove(id: number) {
    const genero = await this.generoRepository.findOneBy({ idGenero: id });
    if (!genero) {
      throw new NotFoundException(`El género con id ${id} no existe`);
    }
    await this.generoRepository.softDelete(id); // borrado lógico
    return { mensaje: `El género con id ${id} fue eliminado` };
  }
}
