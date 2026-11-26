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
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Genero } from './entities/genero.entity';
import { Protegido } from '../auth/decorators/protegido.decorator';

@ApiTags('Géneros')
@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear un género',
    description: 'Datos del género: nombre y descripción (opcional).',
  })
  @ApiCreatedResponse({ description: 'El género fue creada correctamente', type: Genero })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los géneros' })
  @ApiOkResponse({ description: 'Lista de géneros', type: [Genero] })
  findAll() {
    return this.generosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un género por id', description: 'Devuelve el género y incluye sus películas.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del género', example: 1 })
  @ApiOkResponse({ description: 'El género encontrada', type: Genero })
  @ApiNotFoundResponse({ description: 'El género no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.generosService.findOne(id);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar un género', description: 'Datos de el género a modificar (todos opcionales).' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del género', example: 1 })
  @ApiOkResponse({ description: 'El género fue actualizada correctamente', type: Genero })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'El género no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGeneroDto: UpdateGeneroDto) {
    return this.generosService.update(id, updateGeneroDto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar un género',
    description: 'Borrado lógico (soft delete): el registro no se borra, solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id del género', example: 1 })
  @ApiOkResponse({ description: 'El género fue eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'El género no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.generosService.remove(id);
  }
}
