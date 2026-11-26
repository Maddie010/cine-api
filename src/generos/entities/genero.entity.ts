import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';

@Entity('genero')
export class Genero {
  @PrimaryGeneratedColumn()
  idGenero: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // N a M (automática): lado inverso, la tabla pelicula_genero se define en Pelicula
  @ManyToMany(() => Pelicula, (pelicula) => pelicula.generos)
  peliculas: Pelicula[];
}
