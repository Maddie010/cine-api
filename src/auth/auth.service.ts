import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existe = await this.usuarioRepository.existsBy({ email: registerDto.email });
    if (existe) {
      throw new ConflictException(`El correo ${registerDto.email} ya está registrado`);
    }

    const usuario = this.usuarioRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: await bcrypt.hash(registerDto.password, 10), // contraseña encriptada
    });
    const guardado = await this.usuarioRepository.save(usuario);

    // Nunca se devuelve la contraseña
    return {
      idUsuario: guardado.idUsuario,
      username: guardado.username,
      email: guardado.email,
      creadoEn: guardado.creadoEn,
    };
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
      select: { idUsuario: true, username: true, email: true, password: true },
    });

    const passwordValido = usuario && (await bcrypt.compare(loginDto.password, usuario.password));
    if (!usuario || !passwordValido) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = { sub: usuario.idUsuario, username: usuario.username, email: usuario.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
