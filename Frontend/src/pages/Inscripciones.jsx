import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { PageHeader, TableWrap, Th, Td, Badge, Spinner, useToast, Toast } from '../components/UI';

export default function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [carrera, setCarrera] = useState('');
  const [estado, setEstado] = useState('');
  const { toast, show } = useToast();

  async function load() {
    try {
      const [inscripcionesRes, carrerasRes] = await Promise.all([
        api.get('/inscripciones'),
        api.get('/carreras')
      ]);
      setInscripciones(inscripcionesRes.data);
      setCarreras(carrerasRes.data);
    } catch {
      show('Error al cargar', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = inscripciones.filter(i => {
    const texto = `${i.estudiante_nombre || ''} ${i.correo_institucional || ''} ${i.oferta_titulo || ''} ${i.nombre_carrera || ''}`.toLowerCase();
    const matchQ = !query || texto.includes(query.trim().toLowerCase());
    const matchC = !carrera || i.nombre_carrera === carrera;
    const matchE = !estado || i.estado === estado;
    return matchQ && matchC && matchE;
  });

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Inscripciones" subtitle="Gestiona todas las inscripciones de estudiantes" />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 14,
            color: '#8d97b8'
          }}>⌕</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar estudiante..."
            style={{
              width: '100%',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '9px 14px 9px 34px',
              fontFamily: 'inherit',
              fontSize: 13,
              color: 'var(--text)',
              outline: 'none'
            }}
          />
        </div>

        <select
          value={carrera}
          onChange={e => setCarrera(e.target.value)}
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '9px 14px',
            fontFamily: 'inherit',
            fontSize: 13,
            color: '#8d97b8',
            outline: 'none',
            minWidth: 220
          }}
        >
          <option value="">Todas las carreras</option>
          {carreras.map(c => <option key={c.id_carrera} value={c.nombre_carrera}>{c.nombre_carrera}</option>)}
        </select>

        <select
          value={estado}
          onChange={e => setEstado(e.target.value)}
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '9px 14px',
            fontFamily: 'inherit',
            fontSize: 13,
            color: '#8d97b8',
            outline: 'none',
            minWidth: 160
          }}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aceptado">Aceptado</option>
          <option value="finalizado">Finalizado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <TableWrap>
        <thead>
          <tr>
            <Th>Estudiante</Th><Th>Correo</Th><Th>Oferta</Th><Th>Horas</Th><Th>Fecha</Th><Th>Estado</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <Td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
                Sin inscripciones
              </Td>
            </tr>
          )}
          {filtered.map(i => (
            <tr key={i.id_inscripcion}>
              <Td><b style={{ color: 'var(--text)' }}>{i.estudiante_nombre}</b></Td>
              <Td style={{ fontSize: 12 }}>{i.correo_institucional}</Td>
              <Td style={{ fontSize: 12 }}>{i.oferta_titulo}</Td>
              <Td><span style={{ fontSize: 12, color: 'var(--accent)' }}>{i.horas_acreditar}h</span></Td>
              <Td style={{ fontSize: 12 }}>{new Date(i.fecha_inscripcion).toLocaleDateString('es-SV')}</Td>
              <Td><Badge type={i.estado}>{i.estado}</Badge></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Toast toast={toast} />
    </>
  );
}
