import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from './entities/sala.entity';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  create(createSalaDto: CreateSalaDto) {
    const sala = this.salaRepository.create(createSalaDto);
    return this.salaRepository.save(sala);
  }

  findAll() {
    return this.salaRepository.find({ order: { idSala: 'ASC' } });
  }

  async findOne(id: number) {
    const sala = await this.salaRepository.findOne({
      where: { idSala: id },
      relations: { funciones: true },
    });
    if (!sala) {
      throw new NotFoundException(`La sala con id ${id} no existe`);
    }
    return sala;
  }

  async update(id: number, updateSalaDto: UpdateSalaDto) {
    const sala = await this.salaRepository.preload({ idSala: id, ...updateSalaDto });
    if (!sala) {
      throw new NotFoundException(`La sala con id ${id} no existe`);
    }
    await this.salaRepository.save(sala);
    return this.findOne(id);
  }

  async remove(id: number) {
    const sala = await this.salaRepository.findOneBy({ idSala: id });
    if (!sala) {
      throw new NotFoundException(`La sala con id ${id} no existe`);
    }
    await this.salaRepository.softDelete(id); // borrado lógico
    return { mensaje: `La sala con id ${id} fue eliminada` };
  }
}
