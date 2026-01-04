import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HistoricalDataService } from './historical.service';
import { HistoricalQueryDto } from './dto/historical-query.dto';

@Controller('historical')
@ApiTags('Historical Data')
export class HistoricalDataController {
  constructor(private readonly historicalService: HistoricalDataService) {}

  // Converter Endpoints

  @Get('converters')
  @ApiOperation({ summary: 'Get all available converter IDs' })
  @ApiResponse({
    status: 200,
    description: 'List of converter IDs',
    schema: {
      example: ['CONV-001', 'CONV-002', 'CONV-003'],
    },
  })
  async getConverterIds() {
    return this.historicalService.getConverterIds();
  }

  @Get('converters/:id')
  @ApiOperation({ summary: 'Get historical data for a specific converter' })
  @ApiParam({
    name: 'id',
    description: 'Converter ID',
    example: 'CONV-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical converter data',
  })
  async getConverterHistory(
    @Param('id') converterId: string,
    @Query() query: HistoricalQueryDto,
  ) {
    return this.historicalService.getConverterHistory(
      converterId,
      new Date(query.startTime),
      new Date(query.endTime),
      query.aggregation,
      query.limit,
    );
  }

  // Bus Endpoints

  @Get('buses')
  @ApiOperation({ summary: 'Get all available bus IDs' })
  @ApiResponse({
    status: 200,
    description: 'List of bus IDs',
    schema: {
      example: ['BUS-001', 'BUS-002', 'BUS-003', 'BUS-004'],
    },
  })
  async getBusIds() {
    return this.historicalService.getBusIds();
  }

  @Get('buses/:id')
  @ApiOperation({ summary: 'Get historical data for a specific bus' })
  @ApiParam({
    name: 'id',
    description: 'Bus ID',
    example: 'BUS-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical bus data',
  })
  async getBusHistory(
    @Param('id') busId: string,
    @Query() query: HistoricalQueryDto,
  ) {
    return this.historicalService.getBusHistory(
      busId,
      new Date(query.startTime),
      new Date(query.endTime),
      query.aggregation,
      query.limit,
    );
  }

  // RES Endpoints

  @Get('res')
  @ApiOperation({ summary: 'Get all available RES unit IDs' })
  @ApiResponse({
    status: 200,
    description: 'List of RES unit IDs',
    schema: {
      example: ['SOLAR-001', 'WIND-001'],
    },
  })
  async getRESIds() {
    return this.historicalService.getRESIds();
  }

  @Get('res/:id')
  @ApiOperation({ summary: 'Get historical data for a specific RES unit' })
  @ApiParam({
    name: 'id',
    description: 'RES Unit ID',
    example: 'SOLAR-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical RES data',
  })
  async getRESHistory(
    @Param('id') unitId: string,
    @Query() query: HistoricalQueryDto,
  ) {
    return this.historicalService.getRESHistory(
      unitId,
      new Date(query.startTime),
      new Date(query.endTime),
      query.aggregation,
      query.limit,
    );
  }
}
