import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataIngestionService } from './data-ingestion.service';

@ApiTags('data')
@Controller('data')
export class DataIngestionController {
  constructor(private readonly dataIngestionService: DataIngestionService) {}

  @Post('simulation/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start data simulation' })
  @ApiResponse({ status: 200, description: 'Simulation started successfully' })
  startSimulation() {
    return this.dataIngestionService.startSimulation();
  }

  @Post('simulation/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop data simulation' })
  @ApiResponse({ status: 200, description: 'Simulation stopped successfully' })
  stopSimulation() {
    return this.dataIngestionService.stopSimulation();
  }

  @Get('simulation/status')
  @ApiOperation({ summary: 'Get simulation status' })
  @ApiResponse({ status: 200, description: 'Returns simulation status' })
  getSimulationStatus() {
    return this.dataIngestionService.getSimulationStatus();
  }
}
