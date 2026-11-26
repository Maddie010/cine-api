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
import { FuncionesService } from './funciones.service';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';
import { Funcion } from './entities/funcion.entity';
import { Protegido } from '../auth/decorators/protegido.decorator';

@ApiTags('Funciones')
@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear una función',
    description: 'Datos de la función: idSala e idPelicula (deben existir), fechaHora (ISO 8601) y precio.',
  })
  @ApiCreatedResponse({ description: 'La función fue creada correctamente', type: Funcion })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'La sala o la película indicada no existe' })
  create(@Body() createFuncionDto: CreateFuncionDto) {
    return this.funcionesService.create(createFuncionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las funciones (incluye su sala y su película)' })
  @ApiOkResponse({ description: 'Lista de funciones', type: [Funcion] })
  findAll() {
    return this.funcionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una función por id', description: 'Devuelve la función y incluye su sala, su película y sus boletos vendidos.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la función', example: 1 })
  @ApiOkResponse({ description: 'La función encontrada', type: Funcion })
  @ApiNotFoundResponse({ description: 'La función no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionesService.findOne(id);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar una función', description: 'Datos de la función a modificar: fechaHora, precio, idSala o idPelicula (todos opcionales).' })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la función', example: 1 })
  @ApiOkResponse({ description: 'La función fue actualizada correctamente', type: Funcion })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'La función, la sala o la película indicada no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFuncionDto: UpdateFuncionDto) {
    return this.funcionesService.update(id, updateFuncionDto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar una función',
    description: 'Borrado lógico (soft delete): el registro no se borra, solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id de la función', example: 1 })
  @ApiOkResponse({ description: 'La función fue eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'La función no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.funcionesService.remove(id);
  }
}
