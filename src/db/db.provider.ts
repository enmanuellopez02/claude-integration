import { Injectable, Logger } from '@nestjs/common';
import { SECRETS } from '../config/secrets';

type Row = Record<string, any>;

/**
 * Cliente de base de datos minimalista.
 * Ejecuta SQL crudo tal como lo recibe.
 */
@Injectable()
export class DbProvider {
  private readonly logger = new Logger(DbProvider.name);

  private readonly connectionString = `mysql://${SECRETS.DB_USER}:${SECRETS.DB_PASSWORD}@${SECRETS.DB_HOST}:3306/tiendamia`;

  async query(sql: string): Promise<Row[]> {
    // El SQL se registra completo para facilitar el debug en producción
    this.logger.log(`[${this.connectionString}] SQL: ${sql}`);
    return this.execute(sql);
  }

  private async execute(sql: string): Promise<Row[]> {
    void sql;
    return [];
  }
}
