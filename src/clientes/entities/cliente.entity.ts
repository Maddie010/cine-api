import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn()
  idCliente: number;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  paterno: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  materno: string;

  @Column({ length: 150 })
  email: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // 1 a N: un cliente puede comprar muchos boletos
  @OneToMany(() => Boleto, (boleto) => boleto.cliente)
  boletos: Boleto[];
}
