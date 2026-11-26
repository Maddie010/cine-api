import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  idUsuario: number;

  @Column({ length: 100 })
  username: string;

  @Column({ unique: true, length: 150 })
  email: string;

  // select: false -> la contraseña (encriptada) nunca se devuelve en las consultas normales
  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;
}
