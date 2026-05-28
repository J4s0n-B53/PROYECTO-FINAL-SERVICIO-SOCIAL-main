import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { PageHeader, StatCard, TableWrap, Th, Td, Badge, Tag, Spinner, useToast, Toast } from '../components/UI';

/* Generador de PDF: constancia institucional */
function generarPDF(d) {
  const fecha = new Date(d.fecha_inscripcion).toLocaleDateString('es-SV', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const fechaInicio = d.fecha_inicio
    ? new Date(d.fecha_inicio).toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' })
    : '&mdash;';
  const fechaFin = d.fecha_fin
    ? new Date(d.fecha_fin).toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' })
    : '&mdash;';
  const horaInicio = d.hora_inicio ? String(d.hora_inicio).slice(0, 5) : '&mdash;';
  const horaFin = d.hora_fin ? String(d.hora_fin).slice(0, 5) : '&mdash;';
  const hoy = new Date().toLocaleDateString('es-SV', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const codigo = `USO-SS-${d.id_inscripcion.toString().padStart(5, '0')}`;
  const logoUrl = `${window.location.origin}/logo-uso.png`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Constancia de Servicio Social</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Source Sans 3',sans-serif;background:#fff;color:#222}
    .wrap{max-width:700px;margin:32px auto;border:3px solid #1a3a6b;border-radius:4px;overflow:hidden}
    .top-green{background:#2c6e2f;height:8px}
    .top-blue{background:#1a3a6b;padding:6px 0;display:flex;justify-content:center}
    .top-blue span{color:#fff;font-size:11px;letter-spacing:1px;opacity:.75}
    .header-main{padding:28px 40px 20px;display:flex;align-items:center;gap:20px;border-bottom:3px solid #2c6e2f}
    .logo-box{width:70px;height:70px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .logo-box img{width:70px;height:70px;object-fit:contain;display:block}
    .univ-name{font-family:'Playfair Display',serif;color:#1a3a6b;font-size:22px;font-weight:600;line-height:1.2;margin:0}
    .univ-sub{color:#2c6e2f;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:4px}
    .body{padding:32px 40px 28px}
    .doc-title{font-family:'Playfair Display',serif;color:#1a3a6b;font-size:20px;font-weight:600;text-align:center;letter-spacing:1px;margin:0 0 6px}
    .doc-sub{text-align:center;color:#555;font-size:13px;margin:0 0 18px}
    .badge{display:flex;justify-content:center;margin-bottom:24px}
    .badge span{background:#2c6e2f;color:#fff;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:6px 20px;border-radius:100px}
    .body-text{color:#222;font-size:14px;line-height:1.75;text-align:justify;margin-bottom:24px}
    .body-text strong{color:#1a3a6b}
    .info-table{width:100%;border-collapse:collapse;font-size:13.5px;margin-bottom:28px}
    .info-table tr:nth-child(even) td{background:#f0f4fb}
    .info-table td{padding:9px 14px;border:1px solid #d0dae8;vertical-align:top}
    .info-table td:first-child{font-weight:600;color:#1a3a6b;white-space:nowrap;width:38%}
    .info-table td:last-child{color:#222}
    .footer-line{border-top:2px solid #2c6e2f;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px}
    .footer-date{color:#555;font-size:12px}
    .signature-block{text-align:center;font-size:12px;color:#555}
    .signature-line{width:160px;border-top:1.5px solid #1a3a6b;margin:0 auto 4px}
    .sig-name{color:#1a3a6b;font-weight:600;font-size:12px}
    .foot-code{background:#f0f4fb;border-top:1px solid #d0dae8;padding:8px 40px;font-size:10px;color:#6b7a99;text-align:right}
    .bot-green{background:#2c6e2f;height:6px}
    .bot-blue{background:#1a3a6b;height:10px}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script>
  window.addEventListener('load', function() {
    var el = document.querySelector('.wrap');
    var opt = {
      margin: [6, 6, 6, 6],
      filename: document.title + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(el).save();
  });
</script>
</head>
<body>
<div class="wrap">
  <div class="top-green"></div>
  <div class="top-blue"><span>DOCUMENTO OFICIAL</span></div>

  <div class="header-main">
    <div class="logo-box"><img src="${logoUrl}" alt="Logo USO"/></div>
    <div>
      <p class="univ-name">Universidad de Sonsonate</p>
      <p class="univ-sub">Sistema de Servicio Social</p>
    </div>
  </div>

  <div class="body">
    <p class="doc-title">CONSTANCIA DE SERVICIO SOCIAL</p>
    <p class="doc-sub">Documento oficial de acreditaci&oacute;n &mdash; ${d.horas_acreditar} horas acreditadas</p>

    <div class="badge"><span>&#10003; Actividad completada</span></div>

    <p class="body-text">
      La <strong>Universidad de Sonsonate</strong>, a trav&eacute;s de la Coordinaci&oacute;n de Servicio Social,
      hace constar que el/la estudiante <strong>${d.nombre_completo}</strong>,
      con correo institucional <strong>${d.correo_institucional}</strong>, perteneciente a la carrera de
      <strong>${d.nombre_carrera || 'No especificada'}</strong>
      (Facultad de ${d.nombre_facultad || 'No especificada'}),
      complet&oacute; satisfactoriamente la actividad denominada
      <strong>"${d.oferta_titulo}"</strong>, acumulando un total de
      <strong>${d.horas_acreditar} horas</strong> acreditadas.
    </p>

    <table class="info-table">
      <tr><td>Nombre completo</td>      <td>${d.nombre_completo}</td></tr>
      <tr><td>Correo institucional</td> <td>${d.correo_institucional}</td></tr>
      <tr><td>Carrera</td>              <td>${d.nombre_carrera || '&mdash;'}</td></tr>
      <tr><td>Facultad</td>             <td>${d.nombre_facultad || '&mdash;'}</td></tr>
      <tr><td>Actividad</td>            <td>${d.oferta_titulo}</td></tr>
      <tr><td>Descripci&oacute;n</td>          <td>${d.oferta_descripcion || '&mdash;'}</td></tr>
      <tr><td>Ubicaci&oacute;n</td>            <td>${d.ubicacion || '&mdash;'}</td></tr>
      <tr><td>Fecha de inicio</td>      <td>${fechaInicio}</td></tr>
      <tr><td>Fecha de finalizaci&oacute;n</td><td>${fechaFin}</td></tr>
      <tr><td>Hora de inicio</td>       <td>${horaInicio}</td></tr>
      <tr><td>Hora de finalizaci&oacute;n</td> <td>${horaFin}</td></tr>
      <tr><td>Fecha de inscripci&oacute;n</td> <td>${fecha}</td></tr>
      <tr><td>Horas acreditadas</td>    <td><strong>${d.horas_acreditar} horas &#10003;</strong></td></tr>
      <tr><td>Estado</td>               <td><strong>FINALIZADO &#10003;</strong></td></tr>
    </table>

    <div class="footer-line">
      <div class="footer-date">Sonsonate, El Salvador &mdash; ${hoy}</div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="sig-name">Coordinaci&oacute;n de Servicio Social</div>
        <div>Universidad de Sonsonate</div>
      </div>
    </div>
  </div>

  <div class="foot-code">C&oacute;digo de verificaci&oacute;n: ${codigo} | Emitido el ${hoy}</div>
  <div class="bot-green"></div>
  <div class="bot-blue"></div>
</div>
</body>
</html>`;

  const v = window.open('', '_blank');
  v.document.write(html);
  v.document.close();
}

/* Componente principal */
export default function MisInscripciones() {
  const [data,         setData]         = useState([]);
  const [perfil,       setPerfil]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [loadingRep,   setLoadingRep]   = useState(null); // id de la inscripción que está cargando
  const { toast, show } = useToast();

  useEffect(() => {
    Promise.all([
      api.get('/inscripciones'),
      api.get('/usuarios/me')
    ])
      .then(([inscripciones, usuario]) => {
        setData(inscripciones.data);
        setPerfil(usuario.data);
      })
      .catch(() => show('Error al cargar', 'error'))
      .finally(() => setLoading(false));
  }, []);

  async function handleReporte(inscripcionId) {
    setLoadingRep(inscripcionId);
    try {
      const { data: reporte } = await api.get(`/reportes/${inscripcionId}`);
      generarPDF(reporte);
    } catch {
      show('No se pudo generar el reporte', 'error');
    } finally {
      setLoadingRep(null);
    }
  }

  if (loading) return <Spinner />;

  const horasPorOfertas = data.filter(i => i.estado === 'finalizado').reduce((a, i) => a + (i.horas_acreditar || 0), 0);
  const horasAcred   = Number(perfil?.horas_acumuladas ?? horasPorOfertas);
  const horasActivas = data.filter(i => i.estado === 'aceptado').reduce((a, i)   => a + (i.horas_acreditar || 0), 0);
  const totalInscripciones = data.filter(i => i.estado !== 'rechazado').length;

  return (
    <>
      <PageHeader title="Mis inscripciones" subtitle="Seguimiento de tus actividades de servicio social" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total"             value={totalInscripciones}  sub="inscripciones" color="purple" />
        <StatCard label="Horas acreditadas" value={horasAcred}   sub="finalizadas"   color="green"  />
        <StatCard label="Horas en curso"    value={horasActivas} sub="activas"        color="blue"   />
      </div>

      {data.length === 0
        ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
            Aún no tienes inscripciones. Explora las ofertas disponibles.
          </div>
        : <TableWrap>
            <thead><tr>
              <Th>Oferta</Th>
              <Th>Horas</Th>
              <Th>Ubicación</Th>
              <Th>Fecha inscripción</Th>
              <Th>Estado</Th>
              <Th>Reporte</Th>
            </tr></thead>
            <tbody>
              {data.map(i => (
                <tr key={i.id_inscripcion}>
                  <Td><b style={{ color: 'var(--text)' }}>{i.oferta_titulo}</b></Td>
                  <Td><Tag color="blue">{i.horas_acreditar}h</Tag></Td>
                  <Td style={{ fontSize: 12 }}>{i.ubicacion || '—'}</Td>
                  <Td style={{ fontSize: 12 }}>{new Date(i.fecha_inscripcion).toLocaleDateString('es-SV')}</Td>
                  <Td><Badge type={i.estado}>{i.estado}</Badge></Td>
                  <Td>
                    {i.estado === 'finalizado' ? (
                      <button
                        onClick={() => handleReporte(i.id_inscripcion)}
                        disabled={loadingRep === i.id_inscripcion}
                        style={{
                          background: loadingRep === i.id_inscripcion ? '#e0e4f0' : '#0A1B4E',
                          color: loadingRep === i.id_inscripcion ? '#4a5578' : '#fff',
                          border: 'none', borderRadius: 6,
                          padding: '6px 12px', fontSize: 12,
                          fontWeight: 600, cursor: loadingRep === i.id_inscripcion ? 'not-allowed' : 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          transition: '.2s', whiteSpace: 'nowrap',
                        }}
                      >
                        {loadingRep === i.id_inscripcion ? 'Generando...' : (
                          <>
                            <span aria-hidden="true">{'\uD83D\uDCC4'}</span>
                            <span>Constancia</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>—</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
      }
      <Toast toast={toast} />
    </>
  );
}
