const reporteService = require('../services/reporteService');

/* GET /api/reportes/:id — reporte por inscripción (estudiante) */
async function getReporte(req, res) {
  try {
    const data = await reporteService.getReporte(req.params.id, req.user.id);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al generar reporte' });
  }
}

/* GET /api/reportes/global/:estudianteId — reporte global (estudiante o admin) */
async function getReporteGlobal(req, res) {
  try {
    // El estudiante solo puede ver el suyo; el admin puede ver cualquiera
    const estudianteId = req.user.rol === 'admin'
      ? req.params.estudianteId
      : req.user.id;

    const data = await reporteService.getReporteGlobal(estudianteId);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al generar reporte global' });
  }
}

module.exports = { getReporte, getReporteGlobal };