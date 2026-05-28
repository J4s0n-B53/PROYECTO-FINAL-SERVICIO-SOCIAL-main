import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { PageHeader, StatCard, TableWrap, Th, Td, Badge, Spinner, useToast, Toast } from '../components/UI';

/* Generador PDF global: constancia institucional */
function generarPDFGlobal({ estudiante: e, actividades, totalHoras, meta, horasAmbientales = 0, metaAmbiental = 25, ambientalCumplido = false }) {
  const hoy    = new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' });
  const codigo = `USO-SS-GLOBAL-${e.id_usuario.toString().padStart(5, '0')}`;
  const logoUrl = `${window.location.origin}/logo-uso.png`;

  const filas = actividades.map(a => `
    <tr>
      <td>${a.titulo}</td>
      <td>${a.ubicacion || '&mdash;'}</td>
      <td style="text-align:center;font-weight:700;color:#1a3a6b">${a.horas_acreditar}h</td>
      <td>${new Date(a.fecha_inscripcion).toLocaleDateString('es-SV')}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/>
<title>Constancia de Finalizacion de Servicio Social</title>
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
  .section-title{color:#fff;background:#1a3a6b;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:7px 14px;margin-bottom:0;border-radius:3px 3px 0 0}
  .act-table{width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:28px}
  .act-table th{background:#2c6e2f;color:#fff;padding:8px 10px;text-align:left;font-weight:600;font-size:12px}
  .act-table td{border:1px solid #d0dae8;padding:8px 10px;color:#222}
  .act-table tr:nth-child(even) td{background:#f6f9f2}
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
</script></head><body>
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
    <p class="doc-title">CONSTANCIA DE FINALIZACION DE SERVICIO SOCIAL</p>
    <p class="doc-sub">Documento oficial de culminaci&oacute;n &mdash; ${totalHoras} horas acreditadas</p>

    <div class="badge"><span>&#10003; Servicio Social Completado</span></div>

    <p class="body-text">
      La <strong>Universidad de Sonsonate</strong>, a trav&eacute;s de la Coordinaci&oacute;n de Servicio Social,
      hace constar que el/la estudiante <strong>${e.nombre_completo}</strong> ha cumplido
      satisfactoriamente con el total de horas de servicio social requeridas, completando
      <strong>${totalHoras} horas</strong> distribuidas en ${actividades.length} actividad(es),
      superando el requisito m&iacute;nimo de <strong>${meta} horas</strong>.
    </p>

    <table class="info-table">
      <tr><td>Nombre completo</td>      <td>${e.nombre_completo}</td></tr>
      <tr><td>Correo institucional</td> <td>${e.correo_institucional}</td></tr>
      <tr><td>Carrera</td>              <td>${e.nombre_carrera || '&mdash;'}</td></tr>
      <tr><td>Facultad</td>             <td>${e.nombre_facultad || '&mdash;'}</td></tr>
      <tr><td>Requisito ambiental</td>  <td><strong>${horasAmbientales} horas ${ambientalCumplido ? '&#10003;' : ''}</strong></td></tr>
      <tr><td>Total de horas</td>       <td><strong>${totalHoras} horas &#10003;</strong></td></tr>
      <tr><td>Actividades</td>          <td>${actividades.length} completadas</td></tr>
    </table>

    <p class="section-title">Detalle de Actividades Realizadas</p>
    <table class="act-table">
      <thead>
        <tr><th>Actividad</th><th>Ubicaci&oacute;n</th><th>Horas</th><th>Fecha</th></tr>
      </thead>
      <tbody>${filas}</tbody>
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

  <div class="foot-code">C&oacute;digo: ${codigo} | Emitido el ${hoy}</div>
  <div class="bot-green"></div>
  <div class="bot-blue"></div>
</div></body></html>`;

  const v = window.open('', '_blank');
  v.document.write(html);
  v.document.close();
}

/* Componente principal */
export default function Dashboard() {
  const [inscripciones, setInscripciones] = useState([]);
  const [ofertas,       setOfertas]       = useState([]);
  const [usuarios,      setUsuarios]      = useState([]);
  const [carreras,      setCarreras]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [loadingRep,    setLoadingRep]    = useState(null);
  const [queryCompletos, setQueryCompletos] = useState('');
  const [carreraCompletos, setCarreraCompletos] = useState('');
  const { toast, show } = useToast();

  async function load() {
    try {
      const [i, o, u, c] = await Promise.all([
        api.get('/inscripciones'),
        api.get('/ofertas'),
        api.get('/usuarios'),
        api.get('/carreras')
      ]);
      setInscripciones(i.data);
      setOfertas(o.data);
      setUsuarios(u.data);
      setCarreras(c.data);
    } catch { show('Error al cargar datos', 'error'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleReporteGlobal(estudianteId) {
    setLoadingRep(estudianteId);
    try {
      const { data } = await api.get(`/reportes/global/${estudianteId}`);
      generarPDFGlobal(data);
    } catch (err) {
      show(err?.response?.data?.error || 'Error al generar reporte', 'error');
    } finally {
      setLoadingRep(null);
    }
  }

  if (loading) return <Spinner />;

  const activas    = ofertas.filter(o => o.activo).length;
  const pendientes = inscripciones.filter(i => i.estado === 'pendiente').length;
  const recientes  = [...inscripciones].slice(0, 8);

  const estudiantesCompletos = usuarios
    .map(u => ({
      id: u.id_usuario,
      nombre: u.nombre_completo,
      correo: u.correo_institucional,
      carrera: u.nombre_carrera || '',
      horas: Number(u.horas_acumuladas ?? 0),
      ambiental: Boolean(u.ambiental_cumplido) || Number(u.horas_ambientales ?? 0) >= 25,
    }))
    .filter(u => u.horas >= 500 && u.ambiental);
  const estudiantesCompletosFiltrados = estudiantesCompletos.filter(est => {
    const texto = `${est.nombre} ${est.correo}`.toLowerCase();
    const coincideBusqueda = !queryCompletos || texto.includes(queryCompletos.trim().toLowerCase());
    const coincideCarrera = !carreraCompletos || est.carrera === carreraCompletos;
    return coincideBusqueda && coincideCarrera;
  });

  return (
    <>
      <PageHeader title="Panel de control" subtitle="Resumen general del sistema de servicio social" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Ofertas activas" value={activas}              sub="plazas disponibles"  color="blue"   />
        <StatCard label="Inscripciones"   value={inscripciones.length} sub="total registradas"   color="green"  />
        <StatCard label="Pendientes"      value={pendientes}           sub="por revisar"          color="amber"  />
        <StatCard label="Finalizados"     value={estudiantesCompletos.length} sub="500 horas completadas" color="purple" />
      </div>

      {/* Inscripciones recientes */}
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Inscripciones recientes</div>
      <TableWrap>
        <thead><tr>
          <Th>Estudiante</Th><Th>Oferta</Th><Th>Fecha</Th><Th>Estado</Th>
        </tr></thead>
        <tbody>
          {recientes.length === 0 && (
            <tr><Td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>Sin inscripciones aún</Td></tr>
          )}
          {recientes.map(i => (
            <tr key={i.id_inscripcion}>
              <Td><b style={{ color: 'var(--text)' }}>{i.estudiante_nombre?.split(' ').slice(0, 2).join(' ')}</b></Td>
              <Td>{i.oferta_titulo}</Td>
              <Td style={{ fontSize: 12 }}>{new Date(i.fecha_inscripcion).toLocaleDateString('es-SV')}</Td>
              <Td><Badge type={i.estado}>{i.estado}</Badge></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      {/* Seccion: Finalizacion de Servicio Social */}
      <div style={{ marginTop: 40 }}>

        {/* Encabezado de seccion */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#0fce8a,#0be0b8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>✓</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Finalización de Servicio Social</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              Estudiantes que completaron las 500 horas requeridas
            </div>
          </div>
          {estudiantesCompletos.length > 0 && (
            <div style={{
              marginLeft: 'auto',
              background: 'rgba(15,206,138,.12)', color: '#0a9e6a',
              border: '1px solid rgba(15,206,138,.25)',
              borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700,
            }}>
              {estudiantesCompletos.length} completado{estudiantesCompletos.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {estudiantesCompletos.length > 0 && (
          <div style={{
            display:'grid',
            gridTemplateColumns:'minmax(240px,1fr) minmax(220px,320px)',
            gap:10,
            marginBottom:16
          }}>
            <div style={{ position:'relative' }}>
              <span style={{
                position:'absolute',
                left:12,
                top:'50%',
                transform:'translateY(-50%)',
                fontSize:14,
                color:'var(--text3)'
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m21 21-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <input
                value={queryCompletos}
                onChange={e => setQueryCompletos(e.target.value)}
                placeholder="Buscar estudiante..."
                style={{
                  width:'100%',
                  background:'#fff',
                  border:'1px solid rgba(10,27,78,.15)',
                  borderRadius:8,
                  padding:'9px 14px 9px 34px',
                  fontFamily:'inherit',
                  fontSize:13,
                  color:'var(--text)',
                  outline:'none',
                  boxShadow:'0 1px 3px rgba(10,27,78,.06)'
                }}
              />
            </div>
            <select
              value={carreraCompletos}
              onChange={e => setCarreraCompletos(e.target.value)}
              style={{
                background:'#fff',
                border:'1px solid rgba(10,27,78,.15)',
                borderRadius:8,
                padding:'9px 12px',
                fontFamily:'inherit',
                fontSize:13,
                color:'#8d97b8',
                outline:'none',
                boxShadow:'0 1px 3px rgba(10,27,78,.06)'
              }}
            >
              <option value="">Todas las carreras</option>
              {carreras.map(carrera => (
                <option key={carrera.id_carrera} value={carrera.nombre_carrera}>{carrera.nombre_carrera}</option>
              ))}
            </select>
          </div>
        )}

        {estudiantesCompletos.length === 0 ? (
          /* Estado vacio */
          <div style={{
            background: 'var(--bg2)', border: '1px dashed var(--border)',
            borderRadius: 12, padding: '36px 24px', textAlign: 'center',
            color: 'var(--text3)', fontSize: 13,
          }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>✓</div>
            Aún ningún estudiante ha completado las 500 horas de servicio social.
          </div>
        ) : estudiantesCompletosFiltrados.length === 0 ? (
          <div style={{
            background: 'var(--bg2)', border: '1px dashed var(--border)',
            borderRadius: 12, padding: '36px 24px', textAlign: 'center',
            color: 'var(--text3)', fontSize: 13,
          }}>
            No hay estudiantes completados que coincidan con los filtros.
          </div>
        ) : (
          /* Tarjetas de estudiantes completos */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {estudiantesCompletosFiltrados.map(est => (
              <div key={est.id} style={{
                background: 'var(--bg2)',
                border: '1px solid rgba(15,206,138,.25)',
                borderRadius: 12, padding: '18px 20px',
                display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: '0 2px 8px rgba(15,206,138,.08)',
              }}>
                {/* Info del estudiante */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(15,206,138,.15)', color: '#0a9e6a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 700,
                  }}>
                    {est.nombre?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {est.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {est.correo}
                    </div>
                  </div>
                </div>

                {/* Horas */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>Horas acreditadas</div>
                  <div style={{
                    background: 'rgba(15,206,138,.12)', color: '#0a9e6a',
                    borderRadius: 8, padding: '3px 10px', fontSize: 13, fontWeight: 700,
                  }}>
                    {est.horas}h ✓
                  </div>
                </div>

                {/* Boton */}
                <button
                  onClick={() => handleReporteGlobal(est.id)}
                  disabled={loadingRep === est.id}
                  style={{
                    width: '100%',
                    background: loadingRep === est.id
                      ? 'var(--bg3)'
                      : 'linear-gradient(135deg,#0A1B4E,#1344b6)',
                    color: loadingRep === est.id ? 'var(--text3)' : '#fff',
                    border: 'none', borderRadius: 8, padding: '10px 0',
                    fontSize: 12, fontWeight: 700,
                    cursor: loadingRep === est.id ? 'not-allowed' : 'pointer',
                    letterSpacing: .3, transition: '.2s',
                  }}
                >
                  {loadingRep === est.id ? 'Generando...' : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span aria-hidden="true">{'\uD83D\uDCC4'}</span>
                      <span>Descargar Constancia de Finalización</span>
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} />
    </>
  );
}

