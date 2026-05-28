import { PageHeader } from '../components/UI';

const INTEGRANTES = [
  { nombre: 'Brayan Francisco Sion Dimas', codigo: 'SD23-I04-002' },
  { nombre: 'Jason Ernesto Benitez Lopez', codigo: 'BL23-I04-001' },
  { nombre: 'Jorge Reinaldo Colocho Ayala', codigo: 'CA23-I04-001' },
  { nombre: 'Leonardo Antonio Saz Diaz', codigo: 'SD23-I04-001' },
];

function initials(name) {
  return name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

export default function Acerca() {
  return (
    <>
      <PageHeader
        title="Sobre nosotros"
        subtitle="Equipo desarrollador del Sistema de Servicio Social Estudiantil"
      />

      <section style={{
        background:'#fff',
        border:'1px solid rgba(10,27,78,.10)',
        borderRadius:12,
        padding:'28px 32px',
        marginBottom:22,
        boxShadow:'0 1px 4px rgba(10,27,78,.06)',
        maxWidth:920
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <img
            src="/logo-uso.png"
            alt="Logo USO"
            style={{ width:48, height:48, objectFit:'contain' }}
          />
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:'var(--text)' }}>
              SSE<span style={{ color:'var(--green)' }}>.</span>USO
            </div>
            <div style={{ fontSize:13, color:'var(--text3)', marginTop:2 }}>
              Sistema de Servicio Social Estudiantil
            </div>
          </div>
        </div>

        <p style={{ fontSize:14, lineHeight:1.8, color:'var(--text2)', maxWidth:760, marginBottom:18 }}>
          Este proyecto fue desarrollado como una solucion web para administrar ofertas,
          inscripciones, horas acreditadas y constancias del proceso de servicio social
          estudiantil de la Universidad de Sonsonate.
        </p>

        <div style={{
          display:'grid',
          gridTemplateColumns:'1.6fr 1fr 1fr',
          gap:12,
          maxWidth:950
        }}>
          {[
            ['Carrera', 'Ingenieria en Sistemas Computacionales'],
            ['Ciclo academico', '7 ciclo'],
            ['Periodo', '4 año, 1.er ciclo 2026'],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background:'rgba(10,27,78,.04)',
                border:'1px solid rgba(10,27,78,.10)',
                borderRadius:8,
                padding:'12px 14px'
              }}
            >
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1, color:'var(--text3)', fontWeight:700, marginBottom:5 }}>
                {label}
              </div>
              <div style={{ fontSize:13, color:'var(--text)', fontWeight:600, lineHeight:1.35, whiteSpace:'nowrap' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth:920 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:14 }}>
          Equipo desarrollador
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(2,minmax(0,1fr))',
          gap:14
        }}>
          {INTEGRANTES.map(integrante => (
            <article
              key={integrante.codigo}
              style={{
                background:'#fff',
                border:'1px solid rgba(10,27,78,.10)',
                borderRadius:12,
                padding:'18px 20px',
                display:'flex',
                alignItems:'center',
                gap:14,
                boxShadow:'0 1px 4px rgba(10,27,78,.06)'
              }}
            >
              <div style={{
                width:44,
                height:44,
                borderRadius:'50%',
                background:'rgba(10,27,78,.08)',
                color:'var(--accent)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:14,
                fontWeight:800,
                flexShrink:0
              }}>
                {initials(integrante.nombre)}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{
                  fontSize:14,
                  fontWeight:700,
                  color:'var(--text)',
                  lineHeight:1.35
                }}>
                  {integrante.nombre}
                </div>
                <div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>
                  {integrante.codigo}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
