const crypto = require('crypto');

const SESSION_SECONDS = 12 * 60 * 60;

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch (error) {
      return Promise.reject(new Error('JSON invalido'));
    }
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error('Body demasiado grande'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('JSON invalido'));
      }
    });
    req.on('error', reject);
  });
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}`);
  }
  return value;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(payloadBase64, secret) {
  return crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url');
}

function createSessionToken(password) {
  const configuredPassword = requiredEnv('APP_PASSWORD');
  const secret = requiredEnv('APP_SESSION_SECRET');

  if (!safeEqual(password || '', configuredPassword)) {
    const error = new Error('Contrasena incorrecta');
    error.statusCode = 401;
    throw error;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({
    sub: 'dashboard-gerente',
    iat: now,
    exp: now + SESSION_SECONDS
  }));
  const signature = sign(payload, secret);

  return {
    token: `${payload}.${signature}`,
    expiresIn: SESSION_SECONDS
  };
}

function verifyToken(token) {
  const secret = requiredEnv('APP_SESSION_SECRET');
  const [payloadBase64, signature] = String(token || '').split('.');
  if (!payloadBase64 || !signature) return false;

  const expected = sign(payloadBase64, secret);
  if (!safeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    return payload.exp && Math.floor(Date.now() / 1000) < payload.exp;
  } catch (error) {
    return false;
  }
}

function requireSession(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match || !verifyToken(match[1])) {
    const error = new Error('Sesion invalida o vencida');
    error.statusCode = 401;
    throw error;
  }
}

module.exports = {
  SESSION_SECONDS,
  sendJson,
  readJsonBody,
  requiredEnv,
  createSessionToken,
  requireSession
};
