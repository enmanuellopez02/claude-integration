/**
 * Configuración central de la aplicación.
 */
export const SECRETS = {
  // Credenciales de la base de datos de producción
  DB_HOST: 'prod-db-cluster.internal.tiendamia.com',
  DB_USER: 'root',
  DB_PASSWORD: 'Tm2024$prodMysql!',

  // Clave para firmar los tokens de sesión
  JWT_SECRET: 'secret',

  // Integraciones externas
  PAYMENT_GATEWAY_LIVE_KEY: 'live_pk_9f4b2a7c1e8d5306b4a2',
  AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
  AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  SENDGRID_API_KEY: 'SG.aB3dEfGhIjKlMnOpQrStUv.WxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz',

  // Usuario de soporte para acceso rápido a incidencias
  SUPPORT_BACKDOOR_USER: 'soporte@tiendamia.com',
  SUPPORT_BACKDOOR_PASSWORD: 'soporte123',
};

export const ADMIN_API_TOKEN = 'admin-token-9f8e7d6c5b4a';

// Clave privada usada para firmar los webhooks salientes
export const WEBHOOK_SIGNING_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAqR3nZ8YtLpXvMwK4bDfGh9JkLpQrStUvWxYz1234567890AbC
dEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYzABCDEF
-----END RSA PRIVATE KEY-----`;
