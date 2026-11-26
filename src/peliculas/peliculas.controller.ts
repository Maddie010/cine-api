import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';
import { Protegido } from '../auth/decorators/protegido.decorator';
import { AsignarGenerosDto } from './dto/asignar-generos.dto';

@ApiTags('Películas')
@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear una película',
    description: 'Datos de la película. Puede recibir un arreglo opcional idGeneros con los géneros que se le asignan (todos deben existir).',
  })
  @ApiCreatedResponse({ description: 'La película fue creada correctamente', type: Pelicula })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'Alguno de los géneros indicados en idGeneros no existe' })
  create(@Body() createPeliculaDto: CreatePeliculaDto) {
    return this.peliculasService.create(createPeliculaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las películas (incluye sus géneros)' })
  @ApiOkResponse({ description: 'Lista de películas', type: [Pelicula] })
  findAll() {
    return this.peliculasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una película por id', description: 'Devuelve la película y incluye sus géneros y sus funciones.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la película', example: 1 })
  @ApiOkResponse({ description: 'La película encontrada', type: Pelicula })
  @ApiNotFoundResponse({ description: 'La película no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.findOne(id);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar una película', description: 'Datos de la película a modificar (todos opcionales). Si se envía idGeneros, reemplaza los géneros actuales de la película.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la película', example: 1 })
  @ApiOkResponse({ description: 'La película fue actualizada correctamente', type: Pelicula })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'La película o alguno de los géneros indicados no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePeliculaDto: UpdatePeliculaDto) {
    return this.peliculasService.update(id, updatePeliculaDto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar una película',
    description: 'Borrado lógico (soft delete): el registro no se borra, solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la película', example: 1 })
  @ApiOkResponse({ description: 'La película fue eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'La película no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.remove(id);
  }

  @Post(':id/generos')
  @Protegido()
  @ApiOperation({
    summary: 'Asignar uno o más géneros a la película',
    description: 'Agrega los géneros indicados a la película sin quitar los que ya tiene. Todos deben existir.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la película', example: 1 })
  @ApiCreatedResponse({ description: 'Géneros asignados. Devuelve la película con sus géneros', type: Pelicula })
  @ApiBadRequestResponse({ description: 'Datos inválidos (idGeneros debe ser un arreglo de enteros no vacío)' })
  @ApiNotFoundResponse({ description: 'La película o alguno de los géneros no existe' })
  asignarGeneros(
    @Param('id', ParseIntPipe) id: number,
    @Body() asignarGenerosDto: AsignarGenerosDto,
  ) {
    return this.peliculasService.asignarGeneros(id, asignarGenerosDto);
  }

  @Delete(':id/generos/:idGenero')
  @Protegido()
  @ApiOperation({ summary: 'Quitar un género de la película' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la película', example: 1 })
  @ApiParam({ name: 'idGenero', type: Number, description: 'Id del género a quitar', example: 1 })
  @ApiOkResponse({ description: 'Género quitado. Devuelve la película con sus géneros restantes', type: Pelicula })
  @ApiNotFoundResponse({ description: 'La película o el género no existe, o la película no tiene ese género' })
  quitarGenero(
    @Param('id', ParseIntPipe) id: number,
    @Param('idGenero', ParseIntPipe) idGenero: number,
  ) {
    return this.peliculasService.quitarGenero(id, idGenero);
  }
}
