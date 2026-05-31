const { createSessionToken, readJsonBody, sendJson } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Metodo no permitido' });
  }

  try {
    const body = await readJsonBody(req);
    const session = createSessionToken(body.password || '');
    return sendJson(res, 200, session);
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      error: error.message || 'No se pudo iniciar sesion'
    });
  }
};
