import { Injectable, Logger } from '@nestjs/common';
import { GridSimulator } from './simulators/grid-simulator';
import { ConverterSimulator } from './simulators/converter-simulator';
import { RESSimulator } from './simulators/res-simulator';
import { NotificationsService } from '../notifications/notifications.service';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class DataIngestionService {
  private logger = new Logger('DataIngestionService');

  constructor(
    private gridSimulator: GridSimulator,
    private converterSimulator: ConverterSimulator,
    private resSimulator: RESSimulator,
    private notificationsService: NotificationsService,
    private persistenceService: PersistenceService,
  ) {
    // Setup data callbacks
    this.setupSimulators();
  }

  private setupSimulators() {
    // Grid simulator callback
    this.gridSimulator.onData((busData) => {
      busData.forEach((data) => {
        // Persist to database (non-blocking)
        this.persistenceService.queueBusData(data).catch((err) => {
          this.logger.error(`Failed to queue bus data: ${err.message}`);
        });

        // Send real-time WebSocket update
        this.notificationsService.sendBusUpdate(data.busId, data);
      });
    });

    // Converter simulator callback
    this.converterSimulator.onData((converterData) => {
      converterData.forEach((data) => {
        // Persist to database (non-blocking)
        this.persistenceService.queueConverterData(data).catch((err) => {
          this.logger.error(`Failed to queue converter data: ${err.message}`);
        });

        // Send real-time WebSocket update
        this.notificationsService.sendConverterUpdate(data.converterId, data);
      });
    });

    // RES simulator callback
    this.resSimulator.onData((resData) => {
      resData.forEach((data) => {
        // Persist to database (non-blocking)
        this.persistenceService.queueRESData(data).catch((err) => {
          this.logger.error(`Failed to queue RES data: ${err.message}`);
        });

        // Send real-time WebSocket update
        this.notificationsService.sendRESUpdate(data.unitId, data.generation);
      });
    });
  }

  startSimulation() {
    this.logger.log('Starting all simulators');

    this.gridSimulator.start(1000); // 1 second interval
    this.converterSimulator.start(500); // 500ms interval
    this.resSimulator.start(2000); // 2 second interval

    this.notificationsService.sendNotification({
      type: 'success',
      title: 'Simulation Started',
      message: 'All simulators are now running',
    });

    return {
      success: true,
      message: 'Simulation started successfully',
      status: this.getSimulationStatus(),
    };
  }

  stopSimulation() {
    this.logger.log('Stopping all simulators');

    this.gridSimulator.stop();
    this.converterSimulator.stop();
    this.resSimulator.stop();

    this.notificationsService.sendNotification({
      type: 'info',
      title: 'Simulation Stopped',
      message: 'All simulators have been stopped',
    });

    return {
      success: true,
      message: 'Simulation stopped successfully',
    };
  }

  getSimulationStatus() {
    return {
      grid: this.gridSimulator.getStatus(),
      converters: this.converterSimulator.getStatus(),
      res: this.resSimulator.getStatus(),
    };
  }

  // Future: CSV upload processing
  async processCSVUpload(file: Express.Multer.File) {
    this.logger.log(`Processing CSV file: ${file.originalname}`);

    // TODO: Implement CSV parsing and data ingestion
    throw new Error('CSV upload not yet implemented');
  }

  // Future: SCADA data ingestion
  async ingestSCADAData(data: any) {
    this.logger.log('Ingesting SCADA data');

    // TODO: Implement SCADA data processing
    throw new Error('SCADA ingestion not yet implemented');
  }
}
