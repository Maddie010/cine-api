import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar que la API está funcionando' })
  @ApiOkResponse({ description: 'La API responde correctamente' })
  getHello(): string {
    return this.appService.getHello();
  }
}
