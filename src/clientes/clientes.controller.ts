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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Protegido } from '../auth/decorators/protegido.decorator';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear un cliente',
    description: 'Datos del cliente: nombres, apellidos y correo electrónico.',
  })
  @ApiCreatedResponse({ description: 'El cliente fue creada correctamente', type: Cliente })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiOkResponse({ description: 'Lista de clientes', type: [Cliente] })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por id', description: 'Devuelve el cliente y incluye sus boletos con la función de cada uno.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del cliente', example: 1 })
  @ApiOkResponse({ description: 'El cliente encontrada', type: Cliente })
  @ApiNotFoundResponse({ description: 'El cliente no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar un cliente', description: 'Datos de el cliente a modificar (todos opcionales).' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del cliente', example: 1 })
  @ApiOkResponse({ description: 'El cliente fue actualizada correctamente', type: Cliente })
  @ApiBadRequestResponse({ description: 'Datos inválidos (falla alguna validación del body)' })
  @ApiNotFoundResponse({ description: 'El cliente no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar un cliente',
    description: 'Borrado lógico (soft delete): el registro no se borra, solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id del cliente', example: 1 })
  @ApiOkResponse({ description: 'El cliente fue eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'El cliente no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}
