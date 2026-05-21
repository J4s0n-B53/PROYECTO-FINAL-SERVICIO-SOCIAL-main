import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { PageHeader, TableWrap, Th, Td, Badge, Spinner, useToast, Toast } from '../components/UI';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery] = useState('');
  const [carreraFiltro, setCarreraFiltro] = useState('');
  const [horasFiltro, setHorasFiltro] = useState('');
  const [editandoHorasId, setEditandoHorasId] = useState(null);
  const [horasManuales, setHorasManuales] = useState({});
  const [savingHorasId, setSavingHorasId] = useState(null);
  const { toast, show } = useToast();

  async function loadUsuarios() {
    try {
      const r = await api.get('/usuarios');
      setUsuarios(r.data);
      setHorasManuales(Object.fromEntries(
        r.data.map(u => [u.id_usuario, Number(u.horas_manuales ?? 0)])
      ));
    } catch {
      show('Error al cargar usuarios','error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  function editarHoras(u) {
    setHorasManuales(prev => ({ ...prev, [u.id_usuario]: Number(u.horas_manuales ?? 0) }));
    setEditandoHorasId(u.id_usuario);
  }

  function cancelarHoras(u) {
    setHorasManuales(prev => ({ ...prev, [u.id_usuario]: Number(u.horas_manuales ?? 0) }));
    setEditandoHorasId(null);
  }

  async function confirmarHoras(u) {
    const horas = Number(horasManuales[u.id_usuario] ?? 0);
    if (!Number.isInteger(horas) || horas < 0 || horas > 500) {
      show('Ingresa una cantidad válida entre 0 y 500 horas', 'error');
      return;
    }

    setSavingHorasId(u.id_usuario);
    try {
      await api.patch(`/usuarios/${u.id_usuario}/horas-manuales`, { horas_manuales: horas });
      show('Horas manuales actualizadas');
      setEditandoHorasId(null);
      await loadUsuarios();
    } catch (e) {
      show(e.response?.data?.error || 'Error al acreditar horas', 'error');
    } finally {
      setSavingHorasId(null);
    }
  }

  if (loading) return <Spinner />;

  const carreras = [...new Set(usuarios.map(u => u.nombre_carrera).filter(Boolean))].sort();
  const usuariosFiltrados = usuarios.filter(u => {
    const horas = Number(u.horas_acumuladas ?? u.total_horas ?? u.horas ?? 0);
    const texto = `${u.nombre_completo} ${u.correo_institucional}`.toLowerCase();
    const coincideBusqueda = !query || texto.includes(query.trim().toLowerCase());
    const coincideCarrera = !carreraFiltro || u.nombre_carrera === carreraFiltro;
    const coincideHoras =
      !horasFiltro ||
      (horasFiltro === 'completos' && horas >= 500) ||
      (horasFiltro === 'pendientes' && horas < 500);

    return coincideBusqueda && coincideCarrera && coincideHoras;
  });

  return (
    <>
      <PageHeader title="Usuarios" subtitle="Listado de todos los usuarios registrados" />
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
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
          }}>⌕</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
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
          value={carreraFiltro}
          onChange={e => setCarreraFiltro(e.target.value)}
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
          {carreras.map(carrera => <option key={carrera} value={carrera}>{carrera}</option>)}
        </select>
        <select
          value={horasFiltro}
          onChange={e => setHorasFiltro(e.target.value)}
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
          <option value="">Todas las horas</option>
          <option value="completos">Horas completadas</option>
          <option value="pendientes">Horas pendientes</option>
        </select>
      </div>
      <TableWrap>
        <thead><tr>
          <Th>Nombre</Th><Th>Correo</Th><Th>Carrera</Th><Th>Facultad</Th><Th>Materias</Th><Th>Horas</Th><Th>Acreditar horas</Th><Th>Rol</Th>
        </tr></thead>
        <tbody>
          {usuariosFiltrados.map(u => {
            const horas = Number(u.horas_acumuladas ?? u.total_horas ?? u.horas ?? 0);
            const editando = editandoHorasId === u.id_usuario;
            const saving = savingHorasId === u.id_usuario;
            const esEstudiante = u.rol === 'estudiante';

            return (
            <tr key={u.id_usuario}>
              <Td><b style={{ color:'var(--text)' }}>{u.nombre_completo}</b></Td>
              <Td style={{ fontSize:12 }}>{u.correo_institucional}</Td>
              <Td style={{ fontSize:12 }}>{u.nombre_carrera || <span style={{ color:'var(--text3)' }}>—</span>}</Td>
              <Td style={{ fontSize:12 }}>{u.nombre_facultad || <span style={{ color:'var(--text3)' }}>—</span>}</Td>
              <Td>
                <span style={{
                  fontSize:12, padding:'3px 8px', borderRadius:4, fontWeight:500,
                  background: u.materias_aprobadas>=30 ? 'rgba(34,199,138,.15)' : 'rgba(245,166,35,.15)',
                  color: u.materias_aprobadas>=30 ? 'var(--green)' : 'var(--amber)'
                }}>{u.materias_aprobadas}</span>
              </Td>
              <Td>
                <span style={{
                  fontSize:12, padding:'3px 8px', borderRadius:4, fontWeight:600,
                  background: horas>=500 ? 'rgba(34,199,138,.15)' : 'rgba(10,27,78,.08)',
                  color: horas>=500 ? 'var(--green)' : 'var(--text2)'
                }}>{horas}h</span>
              </Td>
              <Td>
                {esEstudiante ? (
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={horasManuales[u.id_usuario] ?? 0}
                      disabled={!editando || saving}
                      onChange={e => setHorasManuales(prev => ({ ...prev, [u.id_usuario]: e.target.value }))}
                      title="Horas manuales externas"
                      style={{
                        width:68,
                        background: editando ? '#fff' : 'rgba(10,27,78,.04)',
                        border:'1px solid rgba(10,27,78,.15)',
                        borderRadius:6,
                        padding:'6px 8px',
                        fontFamily:'inherit',
                        fontSize:12,
                        color: editando ? 'var(--text)' : 'var(--text3)',
                        outline:'none'
                      }}
                    />
                    {editando ? (
                      <>
                        <button
                          type="button"
                          onClick={() => confirmarHoras(u)}
                          disabled={saving}
                          style={{
                            border:'1px solid rgba(15,158,110,.30)',
                            background:'rgba(15,158,110,.10)',
                            color:'var(--green)',
                            borderRadius:6,
                            padding:'6px 9px',
                            fontFamily:'inherit',
                            fontSize:12,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? .55 : 1
                          }}
                        >
                          {saving ? 'Guardando...' : 'Confirmar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelarHoras(u)}
                          disabled={saving}
                          style={{
                            border:'1px solid rgba(10,27,78,.18)',
                            background:'none',
                            color:'var(--text2)',
                            borderRadius:6,
                            padding:'6px 9px',
                            fontFamily:'inherit',
                            fontSize:12,
                            cursor: saving ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => editarHoras(u)}
                        style={{
                          border:'1px solid rgba(10,27,78,.18)',
                          background:'none',
                          color:'var(--text2)',
                          borderRadius:6,
                          padding:'6px 9px',
                          fontFamily:'inherit',
                          fontSize:12,
                          cursor:'pointer'
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </div>
                ) : (
                  <span style={{ color:'var(--text3)' }}>—</span>
                )}
              </Td>
              <Td><Badge type={u.rol}>{u.rol}</Badge></Td>
            </tr>
            );
          })}
          {usuariosFiltrados.length === 0 && (
            <tr>
              <Td style={{ textAlign:'center', padding:40, color:'var(--text3)' }} colSpan={8}>
                No hay usuarios que coincidan con los filtros.
              </Td>
            </tr>
          )}
        </tbody>
      </TableWrap>
      <Toast toast={toast} />
    </>
  );
}
