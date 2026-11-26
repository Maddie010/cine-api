import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genero } from '../../generos/entities/genero.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('pelicula')
export class Pelicula {
  @PrimaryGeneratedColumn()
  idPelicula: number;

  @Column({ length: 150 })
  titulo: string;

  @Column('text')
  sinopsis: string;

  @Column('int')
  duracionMin: number;

  /** ATP, +13 o +18 */
  @Column({ length: 10 })
  clasificacion: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // N a M (automática): TypeORM crea la tabla intermedia pelicula_genero
  // con solo dos columnas: idPelicula e idGenero (ambas PK y FK).
  @ManyToMany(() => Genero, (genero) => genero.peliculas)
  @JoinTable({
    name: 'pelicula_genero',
    joinColumn: { name: 'idPelicula', referencedColumnName: 'idPelicula' },
    inverseJoinColumn: { name: 'idGenero', referencedColumnName: 'idGenero' },
  })
  generos: Genero[];

  // 1 a N: una película tiene muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones: Funcion[];
}
