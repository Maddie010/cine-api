import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  create(createClienteDto: CreateClienteDto) {
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  findAll() {
    return this.clienteRepository.find({ order: { idCliente: 'ASC' } });
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: id },
      relations: { boletos: { funcion: true } }, // sus boletos con la función de cada uno
    });
    if (!cliente) {
      throw new NotFoundException(`El cliente con id ${id} no existe`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.preload({ idCliente: id, ...updateClienteDto });
    if (!cliente) {
      throw new NotFoundException(`El cliente con id ${id} no existe`);
    }
    await this.clienteRepository.save(cliente);
    return this.findOne(id);
  }

  async remove(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ idCliente: id });
    if (!cliente) {
      throw new NotFoundException(`El cliente con id ${id} no existe`);
    }
    await this.clienteRepository.softDelete(id); // borrado lógico
    return { mensaje: `El cliente con id ${id} fue eliminado` };
  }
}
