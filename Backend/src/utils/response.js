
function ok(res, data, status = 200) {
  return res.status(status).json(data);
}

function created(res, data) {
  return res.status(201).json(data);
}

function badRequest(res, message = 'Solicitud inválida') {
  return res.status(400).json({ error: message });
}

function unauthorized(res, message = 'No autorizado') {
  return res.status(401).json({ error: message });
}

function forbidden(res, message = 'Acceso denegado') {
  return res.status(403).json({ error: message });
}

function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({ error: message });
}

function serverError(res, message = 'Error interno del servidor') {
  return res.status(500).json({ error: message });
}

module.exports = { ok, created, badRequest, unauthorized, forbidden, notFound, serverError };
