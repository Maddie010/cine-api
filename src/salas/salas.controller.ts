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
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Sala } from './entities/sala.entity';
import { Protegido } from '../auth/decorators/protegido.decorator';

@ApiTags('Salas')
@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear una sala',
    description: 'Datos de la sala: nombre, capacidad y tipo (2D, 3D o IMAX).',
  })
  @ApiCreatedResponse({ description: 'La sala fue creada correctamente', type: Sala })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salasService.create(createSalaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las salas' })
  @ApiOkResponse({ description: 'Lista de salas', type: [Sala] })
  findAll() {
    return this.salasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sala por id', description: 'Devuelve la sala y incluye sus funciones.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la sala', example: 1 })
  @ApiOkResponse({ description: 'La sala encontrada', type: Sala })
  @ApiNotFoundResponse({ description: 'La sala no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salasService.findOne(id);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar una sala', description: 'Datos de la sala a modificar (todos opcionales).' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la sala', example: 1 })
  @ApiOkResponse({ description: 'La sala fue actualizada correctamente', type: Sala })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'La sala no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salasService.update(id, updateSalaDto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar una sala',
    description: 'Borrado lógico (soft delete): el registro no se borra, solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la sala', example: 1 })
  @ApiOkResponse({ description: 'La sala fue eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'La sala no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salasService.remove(id);
  }
}
