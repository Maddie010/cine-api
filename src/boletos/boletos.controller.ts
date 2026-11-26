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
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';
import { Protegido } from '../auth/decorators/protegido.decorator';

@ApiTags('Boletos')
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Vender un boleto',
    description: 'idFuncion e idCliente (deben existir), numeroAsiento y precioPagado (opcional: si no se envía se usa el precio de la función).',
  })
  @ApiCreatedResponse({ description: 'El boleto fue creada correctamente', type: Boleto })
  @ApiBadRequestResponse({ description: 'Datos inválidos o regla de negocio incumplida (asiento fuera del rango de la sala o ya ocupado en la función)' })
  @ApiNotFoundResponse({ description: 'La función o el cliente indicado no existe' })
  create(@Body() createBoletoDto: CreateBoletoDto) {
    return this.boletosService.create(createBoletoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los boletos' })
  @ApiOkResponse({ description: 'Lista de boletos', type: [Boleto] })
  findAll() {
    return this.boletosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un boleto por id', description: 'Devuelve el boleto y incluye su función y su cliente.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del boleto', example: 1 })
  @ApiOkResponse({ description: 'El boleto encontrada', type: Boleto })
  @ApiNotFoundResponse({ description: 'El boleto no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.findOne(id);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar un boleto', description: 'Datos del boleto a modificar (número de asiento o precio pagado). Se validan las mismas reglas que en la venta.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del boleto', example: 1 })
  @ApiOkResponse({ description: 'El boleto fue actualizada correctamente', type: Boleto })
  @ApiBadRequestResponse({ description: 'Datos inválidos o regla de negocio incumplida (asiento fuera del rango de la sala o ya ocupado en la función)' })
  @ApiNotFoundResponse({ description: 'El boleto, la función o el cliente indicado no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBoletoDto: UpdateBoletoDto) {
    return this.boletosService.update(id, updateBoletoDto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar (anular) un boleto',
    description: 'Borrado lógico (soft delete): el registro no se borra, solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id del boleto', example: 1 })
  @ApiOkResponse({ description: 'El boleto fue eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'El boleto no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.remove(id);
  }
}
