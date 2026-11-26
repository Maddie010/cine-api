import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Sala } from '../../salas/entities/sala.entity';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';

@Entity('funcion')
export class Funcion {
  @PrimaryGeneratedColumn()
  idFuncion: number;

  @Column()
  idSala: number;

  @Column()
  idPelicula: number;

  @Column({ type: 'datetime' })
  fechaHora: Date;

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  precio: number;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // N a 1: una función se realiza en una sola sala
  @ManyToOne(() => Sala, (sala) => sala.funciones)
  @JoinColumn({ name: 'idSala' })
  sala: Relation<Sala>;

  // N a 1: una función proyecta una sola película
  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones)
  @JoinColumn({ name: 'idPelicula' })
  pelicula: Relation<Pelicula>;

  // 1 a N: boletos vendidos para esta función
  @OneToMany(() => Boleto, (boleto) => boleto.funcion)
  boletos: Boleto[];
}
