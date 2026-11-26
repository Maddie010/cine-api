import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Boleto } from './entities/boleto.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Funcion)
    private readonly funcionRepository: Repository<Funcion>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createBoletoDto: CreateBoletoDto) {
    const funcion = await this.buscarFuncion(createBoletoDto.idFuncion);
    await this.buscarCliente(createBoletoDto.idCliente);
    await this.validarAsiento(funcion, createBoletoDto.numeroAsiento);

    const boleto = this.boletoRepository.create({
      idFuncion: createBoletoDto.idFuncion,
      idCliente: createBoletoDto.idCliente,
      numeroAsiento: createBoletoDto.numeroAsiento,
      // Si no se envía precioPagado se guarda el precio de la función
      precioPagado: createBoletoDto.precioPagado ?? funcion.precio,
    });
    const guardado = await this.boletoRepository.save(boleto);
    return this.findOne(guardado.idBoleto);
  }

  findAll() {
    return this.boletoRepository.find({ order: { idBoleto: 'ASC' } });
  }

  async findOne(id: number) {
    const boleto = await this.boletoRepository.findOne({
      where: { idBoleto: id },
      relations: { funcion: true, cliente: true },
    });
    if (!boleto) {
      throw new NotFoundException(`El boleto con id ${id} no existe`);
    }
    return boleto;
  }

  async update(id: number, updateBoletoDto: UpdateBoletoDto) {
    const boleto = await this.boletoRepository.findOneBy({ idBoleto: id });
    if (!boleto) {
      throw new NotFoundException(`El boleto con id ${id} no existe`);
    }

    // Valores finales del boleto (los que no se envían se mantienen)
    const idFuncion = updateBoletoDto.idFuncion ?? boleto.idFuncion;
    const numeroAsiento = updateBoletoDto.numeroAsiento ?? boleto.numeroAsiento;

    const funcion = await this.buscarFuncion(idFuncion);
    if (updateBoletoDto.idCliente !== undefined) {
      await this.buscarCliente(updateBoletoDto.idCliente);
    }
    // Las mismas reglas de la venta, ignorando el propio boleto
    await this.validarAsiento(funcion, numeroAsiento, id);

    Object.assign(boleto, updateBoletoDto);
    await this.boletoRepository.save(boleto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const boleto = await this.boletoRepository.findOneBy({ idBoleto: id });
    if (!boleto) {
      throw new NotFoundException(`El boleto con id ${id} no existe`);
    }
    // Anular = borrado lógico. El asiento queda libre para volver a venderse.
    await this.boletoRepository.softDelete(id);
    return { mensaje: `El boleto con id ${id} fue anulado` };
  }

  private async buscarFuncion(idFuncion: number) {
    const funcion = await this.funcionRepository.findOne({
      where: { idFuncion },
      relations: { sala: true },
    });
    if (!funcion) {
      throw new NotFoundException(`La función con id ${idFuncion} no existe`);
    }
    if (!funcion.sala) {
      throw new BadRequestException(
        `La sala de la función con id ${idFuncion} fue eliminada, no se pueden vender boletos`,
      );
    }
    return funcion;
  }

  private async buscarCliente(idCliente: number) {
    const cliente = await this.clienteRepository.findOneBy({ idCliente });
    if (!cliente) {
      throw new NotFoundException(`El cliente con id ${idCliente} no existe`);
    }
    return cliente;
  }

  /**
   * Reglas de negocio de la venta de boletos:
   *  1. El asiento debe estar entre 1 y la capacidad de la sala.
   *  2. El asiento no puede estar ocupado en la misma función.
   */
  private async validarAsiento(funcion: Funcion, numeroAsiento: number, ignorarIdBoleto?: number) {
    const { capacidad, nombre } = funcion.sala;
    if (numeroAsiento < 1 || numeroAsiento > capacidad) {
      throw new BadRequestException(
        `El asiento ${numeroAsiento} no es válido: la sala "${nombre}" tiene capacidad para ${capacidad} asientos (del 1 al ${capacidad})`,
      );
    }

    const ocupado = await this.boletoRepository.existsBy({
      idFuncion: funcion.idFuncion,
      numeroAsiento,
      ...(ignorarIdBoleto !== undefined && { idBoleto: Not(ignorarIdBoleto) }),
    });
    if (ocupado) {
      throw new BadRequestException(
        `El asiento ${numeroAsiento} ya está ocupado para la función con id ${funcion.idFuncion}`,
      );
    }
  }
}
