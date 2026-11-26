import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('sala')
export class Sala {
  @PrimaryGeneratedColumn()
  idSala: number;

  @Column({ length: 100 })
  nombre: string;

  @Column('int')
  capacidad: number;

  /** 2D, 3D o IMAX */
  @Column({ length: 10 })
  tipo: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // 1 a N: una sala tiene muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
}
