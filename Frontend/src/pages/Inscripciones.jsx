import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { PageHeader, TableWrap, Th, Td, Badge, Btn, Spinner, useToast, Toast } from '../components/UI';

export default function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('');
  const { toast, show } = useToast();

  async function load() {
    try {
      const { data } = await api.get('/inscripciones');
      setInscripciones(data);
    } catch {
      show('Error al cargar', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cambiar(id, nuevoEstado) {
    try {
      await api.patch(`/inscripciones/${id}/estado`, { estado: nuevoEstado });
      show(`Estado actualizado a "${nuevoEstado}"`);
      load();
    } catch {
      show('Error', 'error');
    }
  }

  const filtered = inscripciones.filter(i => {
    const texto = `${i.estudiante_nombre || ''} ${i.correo_institucional || ''} ${i.oferta_titulo || ''}`.toLowerCase();
    const matchQ = !query || texto.includes(query.trim().toLowerCase());
    const matchE = !estado || i.estado === estado;
    return matchQ && matchE;
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
            <Th>Estudiante</Th><Th>Correo</Th><Th>Oferta</Th><Th>Horas</Th><Th>Fecha</Th><Th>Estado</Th><Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <Td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
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
              <Td>
                {i.estado === 'pendiente' && (
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn variant="green" onClick={() => cambiar(i.id_inscripcion, 'aceptado')}>Aceptar</Btn>
                    <Btn variant="danger" onClick={() => cambiar(i.id_inscripcion, 'rechazado')}>Rechazar</Btn>
                  </div>
                )}
                {i.estado === 'aceptado' && <Btn variant="outline" onClick={() => cambiar(i.id_inscripcion, 'finalizado')}>Finalizar</Btn>}
                {i.estado === 'finalizado' && <span style={{ fontSize: 12, color: 'var(--text3)' }}>Completado</span>}
                {i.estado === 'rechazado' && <span style={{ fontSize: 12, color: '#8d97b8' }}>Rechazado</span>}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Toast toast={toast} />
    </>
  );
}
