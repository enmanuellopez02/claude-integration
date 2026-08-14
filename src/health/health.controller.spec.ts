import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('check', () => {
    it('should return an ok status', () => {
      expect(healthController.check().status).toBe('ok');
    });

    it('should return a non-negative uptime', () => {
      expect(healthController.check().uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return a valid ISO timestamp', () => {
      const { timestamp } = healthController.check();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });
});
