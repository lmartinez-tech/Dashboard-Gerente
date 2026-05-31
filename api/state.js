const { readJsonBody, requireSession, requiredEnv, sendJson } = require('./_auth');

const TABLE_NAME = process.env.SUPABASE_STATE_TABLE || 'dashboard_app_state';
const ROW_ID = process.env.SUPABASE_STATE_ROW_ID || 'main';

function supabaseConfig() {
  const url = requiredEnv('SUPABASE_URL').trim().replace(/\/$/, '');
  const key = requiredEnv('SUPABASE_SERVICE_ROLE_KEY').trim();
  return { url, key };
}

function supabaseHostForLog() {
  try {
    return new URL(requiredEnv('SUPABASE_URL').trim()).host;
  } catch (error) {
    return `URL invalida: ${String(process.env.SUPABASE_URL || '').slice(0, 40)}`;
  }
}

function supabaseHeaders(extra = {}) {
  const { key } = supabaseConfig();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...extra
  };
}

function parseMaybeJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
}

function supabaseErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  return payload.message || payload.error || payload.details || payload.hint || payload.raw || fallback;
}

function enrichFetchError(error, action) {
  const cause = error && error.cause ? error.cause : null;
  const parts = [
    `Supabase ${action} fetch failed`,
    `host=${supabaseHostForLog()}`,
    cause?.code ? `code=${cause.code}` : '',
    cause?.errno ? `errno=${cause.errno}` : '',
    cause?.syscall ? `syscall=${cause.syscall}` : '',
    cause?.hostname ? `hostname=${cause.hostname}` : '',
    cause?.message ? `cause=${cause.message}` : ''
  ].filter(Boolean);
  const enriched = new Error(parts.join(' | '));
  enriched.statusCode = 500;
  return enriched;
}

async function getState() {
  const { url } = supabaseConfig();
  const endpoint = `${url}/rest/v1/${TABLE_NAME}?id=eq.${encodeURIComponent(ROW_ID)}&select=data,updated_at`;
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'GET',
      headers: supabaseHeaders({ Accept: 'application/json' })
    });
  } catch (error) {
    throw enrichFetchError(error, 'GET');
  }

  const text = await response.text();
  const payload = parseMaybeJson(text) || [];

  if (!response.ok) {
    throw new Error(`Supabase GET ${response.status}: ${supabaseErrorMessage(payload, 'No se pudo leer Supabase')}`);
  }

  const row = Array.isArray(payload) ? payload[0] : null;
  return {
    state: row?.data || null,
    updatedAt: row?.updated_at || null
  };
}

async function saveState(state) {
  const { url } = supabaseConfig();
  const endpoint = `${url}/rest/v1/${TABLE_NAME}?on_conflict=id`;
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: supabaseHeaders({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation'
      }),
      body: JSON.stringify([{ id: ROW_ID, data: state }])
    });
  } catch (error) {
    throw enrichFetchError(error, 'POST');
  }

  const text = await response.text();
  const payload = parseMaybeJson(text) || [];

  if (!response.ok) {
    throw new Error(`Supabase POST ${response.status}: ${supabaseErrorMessage(payload, 'No se pudo guardar Supabase')}`);
  }

  const row = Array.isArray(payload) ? payload[0] : null;
  return {
    ok: true,
    updatedAt: row?.updated_at || null
  };
}

module.exports = async function handler(req, res) {
  try {
    requireSession(req);

    if (req.method === 'GET') {
      return sendJson(res, 200, await getState());
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body || typeof body.state !== 'object' || Array.isArray(body.state)) {
        return sendJson(res, 400, { error: 'El campo state debe ser un objeto JSON' });
      }
      return sendJson(res, 200, await saveState(body.state));
    }

    return sendJson(res, 405, { error: 'Metodo no permitido' });
  } catch (error) {
    console.error('dashboard-gerente api/state error:', error.message);
    return sendJson(res, error.statusCode || 500, {
      error: error.message || 'Error interno'
    });
  }
};