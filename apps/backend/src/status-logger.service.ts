import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class StatusLoggerService {
  private readonly logger = new Logger(
    StatusLoggerService.name,
  );

  @Interval(10000) // 10 seconds
  logStatus() {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] System Status: OK`);
  }
}
