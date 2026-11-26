import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';

/**
 * Tabla intermedia (creada a mano) de la relación N a M entre Funcion y Cliente.
 * Además de las dos llaves foráneas guarda datos de la venta:
 * el número de asiento y el precio pagado.
 */
@Entity('boleto')
export class Boleto {
  @PrimaryGeneratedColumn()
  idBoleto: number;

  @Column()
  idFuncion: number;

  @Column()
  idCliente: number;

  @Column('int')
  numeroAsiento: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  precioPagado: number;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  @ManyToOne(() => Funcion, (funcion) => funcion.boletos)
  @JoinColumn({ name: 'idFuncion' })
  funcion: Relation<Funcion>;

  @ManyToOne(() => Cliente, (cliente) => cliente.boletos)
  @JoinColumn({ name: 'idCliente' })
  cliente: Relation<Cliente>;
}
