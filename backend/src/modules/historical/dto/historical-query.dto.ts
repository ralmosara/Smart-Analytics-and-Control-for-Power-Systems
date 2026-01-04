import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class HistoricalQueryDto {
  @ApiProperty({
    description: 'Start time for the query range (ISO 8601 format)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End time for the query range (ISO 8601 format)',
    example: '2024-01-02T00:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Aggregation interval for time-series data',
    enum: ['raw', '1min', '5min', '1hour'],
    required: false,
    default: 'raw',
  })
  @IsOptional()
  @IsEnum(['raw', '1min', '5min', '1hour'])
  aggregation?: 'raw' | '1min' | '5min' | '1hour' = 'raw';

  @ApiProperty({
    description: 'Maximum number of records to return',
    minimum: 1,
    maximum: 10000,
    default: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  limit?: number = 1000;
}
