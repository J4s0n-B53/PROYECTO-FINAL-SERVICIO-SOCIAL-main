import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { Spinner, useToast, Toast } from '../components/UI';

function initials(n = '') { return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(); }

function ProgressBar({ label, value, max, colorA, colorB }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 3,
          background: `linear-gradient(90deg,${colorA} 0%,${colorB} 100%)`,
          transition: 'width 1s ease'
        }} />
      </div>
    </div>
  );
}

/* ── Generador PDF global — diseño constancia institucional ─────────────── */
function generarPDFGlobal({ estudiante: e, actividades, totalHoras, meta }) {
  const hoy    = new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' });
  const codigo = `USO-SS-GLOBAL-${e.id_usuario.toString().padStart(5, '0')}`;

  const filas = actividades.map(a => `
    <tr>
      <td>${a.titulo}</td>
      <td>${a.ubicacion || '—'}</td>
      <td style="text-align:center;font-weight:700;color:#1a3a6b">${a.horas_acreditar}h</td>
      <td>${new Date(a.fecha_inscripcion).toLocaleDateString('es-SV')}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/>
<title>Constancia Global de Servicio Social</title>
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
  .logo-box{background:#1a3a6b;color:#fff;font-family:'Source Sans 3',sans-serif;font-weight:600;font-size:20px;letter-spacing:2px;width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:6px;flex-shrink:0}
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
  .section-title{color:#fff;background:#1a3a6b;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:7px 14px;border-radius:3px 3px 0 0}
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
    <div class="logo-box">USO</div>
    <div>
      <p class="univ-name">Universidad de Sonsonate</p>
      <p class="univ-sub">Sistema de Servicio Social</p>
    </div>
  </div>

  <div class="body">
    <p class="doc-title">CONSTANCIA GLOBAL DE SERVICIO SOCIAL</p>
    <p class="doc-sub">Documento oficial de culminación — ${totalHoras} horas acreditadas</p>

    <div class="badge"><span>✓ Servicio Social Completado</span></div>

    <p class="body-text">
      La <strong>Universidad de Sonsonate</strong>, a través de la Coordinación de Servicio Social,
      hace constar que el/la estudiante <strong>${e.nombre_completo}</strong> ha cumplido
      satisfactoriamente con el total de horas de servicio social requeridas, completando
      <strong>${totalHoras} horas</strong> distribuidas en ${actividades.length} actividad(es),
      superando el requisito mínimo de <strong>${meta} horas</strong> establecido por la institución.
    </p>

    <table class="info-table">
      <tr><td>Nombre completo</td>      <td>${e.nombre_completo}</td></tr>
      <tr><td>Correo institucional</td> <td>${e.correo_institucional}</td></tr>
      <tr><td>Carrera</td>              <td>${e.nombre_carrera || '—'}</td></tr>
      <tr><td>Facultad</td>             <td>${e.nombre_facultad || '—'}</td></tr>
      <tr><td>Materias aprobadas</td>   <td>${e.materias_aprobadas} / 60</td></tr>
      <tr><td>Total de horas</td>       <td><strong>${totalHoras} horas ✓</strong></td></tr>
    </table>

    <p class="section-title">Detalle de Actividades Realizadas</p>
    <table class="act-table">
      <thead>
        <tr><th>Actividad</th><th>Ubicación</th><th>Horas</th><th>Fecha</th></tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>

    <div class="footer-line">
      <div class="footer-date">Sonsonate, El Salvador — ${hoy}</div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="sig-name">Coordinación de Servicio Social</div>
        <div>Universidad de Sonsonate</div>
      </div>
    </div>
  </div>

  <div class="foot-code">Código: ${codigo} | Emitido el ${hoy}</div>
  <div class="bot-green"></div>
  <div class="bot-blue"></div>
</div></body></html>`;

  const v = window.open('', '_blank');
  v.document.write(html);
  v.document.close();
}

/* ── Componente Perfil ───────────────────────────────────────────────────── */
export default function Perfil() {
  const { user }  = useAuth();
  const [perfil,  setPerfil]  = useState(null);
  const [insc,    setInsc]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRep, setLoadingRep] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    Promise.all([api.get('/usuarios/me'), api.get('/inscripciones')])
      .then(([p, i]) => { setPerfil(p.data); setInsc(i.data); })
      .catch(() => show('Error al cargar', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!perfil)  return null;

  const horasPorOfertas = insc.filter(i => i.estado === 'finalizado').reduce((a, i) => a + (i.horas_acreditar || 0), 0);
  const horasAcred = Number(perfil.horas_acumuladas ?? (horasPorOfertas + Number(perfil.horas_manuales ?? 0)));
  const elegible   = perfil.materias_aprobadas >= 30;
  const META       = 500;
  const completado = horasAcred >= META;

  async function handleReporteGlobal() {
    setLoadingRep(true);
    try {
      const { data } = await api.get(`/reportes/global/${user.id}`);
      generarPDFGlobal(data);
    } catch (err) {
      show(err?.response?.data?.error || 'Error al generar reporte', 'error');
    } finally {
      setLoadingRep(false);
    }
  }

  return (
    <>
      <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, fontWeight: 400, letterSpacing: -.3, marginBottom: 28, color: 'var(--text)' }} className="fade-up">
        Mi perfil
      </h1>

      <div style={{
        background: '#0A1B4E', borderRadius: 16, padding: '28px 32px', maxWidth: 580,
        boxShadow: '0 8px 32px rgba(10,27,78,.25)'
      }} className="fade-up">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(15,200,138,.25)', color: '#6fe0b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, border: '2px solid rgba(15,200,138,.30)'
          }}>{initials(perfil.nombre_completo)}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{perfil.nombre_completo}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)' }}>{perfil.correo_institucional}</div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.10)', marginBottom: 20 }} />

        {/* Meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
          {[
            ['Carrera',            perfil.nombre_carrera || 'No asignada'],
            ['Facultad',           perfil.nombre_facultad || '—'],
            ['Materias aprobadas', `${perfil.materias_aprobadas} / 60`],
            ['Elegibilidad',       elegible ? '✓ Apto para servicio' : 'Pendiente (mín. 30 materias)'],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, fontWeight: 600 }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: l === 'Elegibilidad' ? (elegible ? '#6fe0b8' : '#f5c46a') : 'rgba(255,255,255,0.85)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <ProgressBar label="Avance académico"                    value={perfil.materias_aprobadas} max={60}  colorA="#c066ff" colorB="#4f8cff" />
        <ProgressBar label="Horas de servicio social acreditadas" value={horasAcred}               max={META} colorA="#0fce8a" colorB="#0be0b8" />

        {/* Botón constancia global — solo visible al completar 500h */}
        {completado && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
            <div style={{ fontSize: 12, color: '#6fe0b8', marginBottom: 12, fontWeight: 600 }}>
              🎓 ¡Felicidades! Completaste las {META} horas de servicio social.
            </div>
            <button
              onClick={handleReporteGlobal}
              disabled={loadingRep}
              style={{
                width: '100%',
                background: loadingRep ? 'rgba(255,255,255,0.10)' : 'linear-gradient(135deg,#0fce8a,#0be0b8)',
                color: loadingRep ? 'rgba(255,255,255,0.40)' : '#0A1B4E',
                border: 'none', borderRadius: 8, padding: '12px 0',
                fontSize: 13, fontWeight: 700, cursor: loadingRep ? 'not-allowed' : 'pointer',
                letterSpacing: .5, transition: '.2s',
              }}
            >
              {loadingRep ? 'Generando constancia…' : '📄 Descargar Constancia De Finalizacion'}
            </button>
          </div>
        )}
      </div>

      <Toast toast={toast} />
    </>
  );
}
