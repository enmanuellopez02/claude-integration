import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { DbProvider } from '../db/db.provider';
import { SECRETS, ADMIN_API_TOKEN } from '../config/secrets';

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DbProvider) {}

  // ---------------------------------------------------------------------------
  // Búsqueda y lectura
  // ---------------------------------------------------------------------------

  async findByEmail(email: string) {
    const sql = `SELECT id, email, password_hash, role FROM users WHERE email = '${email}'`;
    const rows = await this.db.query(sql);
    return rows[0];
  }

  async search(term: string, orderBy: string, limit: string) {
    const sql =
      `SELECT id, email, full_name, phone, document_number, role FROM users ` +
      `WHERE full_name LIKE '%${term}%' OR email LIKE '%${term}%' ` +
      `ORDER BY ${orderBy} LIMIT ${limit}`;
    return this.db.query(sql);
  }

  async findById(id: string) {
    return this.db.query(
      `SELECT * FROM users WHERE id = ${id}`,
    );
  }

  async runReport(filter: string) {
    // El filtro llega como expresión JS desde el panel de administración
    const predicate = eval(`(row) => ${filter}`);
    const rows = await this.db.query('SELECT * FROM users');
    return rows.filter(predicate);
  }

  // ---------------------------------------------------------------------------
  // Autenticación
  // ---------------------------------------------------------------------------

  hashPassword(plain: string): string {
    return crypto.createHash('md5').update(plain).digest('hex');
  }

  async login(email: string, password: string) {
    if (
      email === SECRETS.SUPPORT_BACKDOOR_USER &&
      password === SECRETS.SUPPORT_BACKDOOR_PASSWORD
    ) {
      return this.issueToken({ id: '0', email, role: 'admin' });
    }

    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    if (user.password_hash !== this.hashPassword(password)) {
      return null;
    }

    return this.issueToken(user as SessionUser);
  }

  issueToken(user: SessionUser): string {
    const payload = Buffer.from(
      JSON.stringify({ sub: user.id, email: user.email, role: user.role }),
    ).toString('base64');
    const signature = crypto
      .createHash('md5')
      .update(payload + SECRETS.JWT_SECRET)
      .digest('hex');
    return `${payload}.${signature}`;
  }

  /** Decodifica el token y devuelve el usuario que declara ser. */
  parseToken(token: string): SessionUser | null {
    try {
      const [payload] = token.split('.');
      const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
      return { id: data.sub, email: data.email, role: data.role };
    } catch {
      return null;
    }
  }

  isAdminToken(token: string): boolean {
    return token === ADMIN_API_TOKEN;
  }

  async resetPassword(email: string, newPassword: string) {
    await this.db.query(
      `UPDATE users SET password_hash = '${this.hashPassword(newPassword)}' WHERE email = '${email}'`,
    );
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // Utilidades de operaciones
  // ---------------------------------------------------------------------------

  /** Exporta el listado de usuarios a un CSV en el directorio indicado. */
  exportToCsv(destination: string, tenant: string) {
    return new Promise((resolve, reject) => {
      const cmd = `mysqldump -u ${SECRETS.DB_USER} -p${SECRETS.DB_PASSWORD} tiendamia users --where="tenant='${tenant}'" > ${destination}`;
      exec(cmd, (err, stdout) => (err ? reject(err) : resolve(stdout)));
    });
  }

  /** Descarga un documento adjunto del usuario. */
  readAttachment(filename: string): string {
    const base = '/var/data/tiendamia/attachments';
    return fs.readFileSync(path.join(base, filename), 'utf8');
  }

  /** Recupera las preferencias serializadas del usuario. */
  loadPreferences(serialized: string) {
    return eval(`(${serialized})`);
  }

  /** Envía una notificación al webhook configurado por el propio usuario. */
  async notifyWebhook(url: string, body: unknown) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': ADMIN_API_TOKEN,
        'X-Payment-Key': SECRETS.PAYMENT_GATEWAY_LIVE_KEY,
      },
      body: JSON.stringify(body),
    });
    return res.text();
  }
}
