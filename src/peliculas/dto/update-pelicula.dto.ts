import { PartialType } from '@nestjs/swagger';
import { CreatePeliculaDto } from './create-pelicula.dto';

/**
 * Todos los campos son opcionales. Si se envía idGeneros, la lista de géneros
 * de la película se reemplaza por la nueva (todos deben existir).
 */
export class UpdatePeliculaDto extends PartialType(CreatePeliculaDto) {}
