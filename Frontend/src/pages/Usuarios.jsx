import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { PageHeader, TableWrap, Th, Td, Badge, Modal, Spinner, useToast, Toast } from '../components/UI';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery] = useState('');
  const [carreraFiltro, setCarreraFiltro] = useState('');
  const [horasFiltro, setHorasFiltro] = useState('');
  const [editandoHorasId, setEditandoHorasId] = useState(null);
  const [horasManuales, setHorasManuales] = useState({});
  const [savingHorasId, setSavingHorasId] = useState(null);
  const [confirmacionHoras, setConfirmacionHoras] = useState(null);
  const { toast, show } = useToast();

  async function loadUsuarios() {
    try {
      const r = await api.get('/usuarios');
      setUsuarios(r.data);
      setHorasManuales(Object.fromEntries(
        r.data.map(u => [u.id_usuario, 0])
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
    setHorasManuales(prev => ({ ...prev, [u.id_usuario]: 0 }));
    setEditandoHorasId(u.id_usuario);
  }

  function cancelarHoras(u) {
    setHorasManuales(prev => ({ ...prev, [u.id_usuario]: 0 }));
    setEditandoHorasId(null);
  }

  async function confirmarHoras(u) {
    const horas = Number(horasManuales[u.id_usuario] ?? 0);
    if (!Number.isInteger(horas) || horas <= 0 || horas > 500) {
      show('Ingresa una cantidad valida entre 1 y 500 horas', 'error');
      return;
    }

    setConfirmacionHoras({ usuario: u, horas });
  }

  async function guardarHorasConfirmadas() {
    if (!confirmacionHoras) return;

    const u = confirmacionHoras.usuario;
    const horas = confirmacionHoras.horas;

    setSavingHorasId(u.id_usuario);
    try {
      const { data } = await api.patch(`/usuarios/${u.id_usuario}/horas-manuales`, { horas_manuales: horas });
      const acreditadas = Number(data.horas_acreditadas ?? horas);
      show(data.ajustado ? `Se acreditaron ${acreditadas} horas, que era el espacio disponible` : `${acreditadas} horas acreditadas`);
      setEditandoHorasId(null);
      setConfirmacionHoras(null);
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
          <option value="">Todos los estudiantes</option>
          <option value="completos">Servicio social completado</option>
          <option value="pendientes">Servicio social pendiente</option>
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
            const rowActiveStyle = editando
              ? { background:'#0A1B4E', color:'#fff', transition:'background .2s ease, color .2s ease' }
              : {};
            const mainTextColor = editando ? '#fff' : 'var(--text)';
            const secondaryTextColor = editando ? 'rgba(255,255,255,.78)' : 'var(--text2)';

            return (
            <tr key={u.id_usuario}>
              <Td style={rowActiveStyle}><b style={{ color:mainTextColor }}>{u.nombre_completo}</b></Td>
              <Td style={{ ...rowActiveStyle, fontSize:12, color:secondaryTextColor }}>{u.correo_institucional}</Td>
              <Td style={{ ...rowActiveStyle, fontSize:12, color:secondaryTextColor }}>{u.nombre_carrera || '-'}</Td>
              <Td style={{ ...rowActiveStyle, fontSize:12, color:secondaryTextColor }}>{u.nombre_facultad || '-'}</Td>
              <Td style={rowActiveStyle}>
                <span style={{
                  fontSize:12, padding:'3px 8px', borderRadius:4, fontWeight:500,
                  background: editando ? 'rgba(255,255,255,.16)' : u.materias_aprobadas>=30 ? 'rgba(34,199,138,.15)' : 'rgba(245,166,35,.15)',
                  color: editando ? '#fff' : u.materias_aprobadas>=30 ? 'var(--green)' : 'var(--amber)'
                }}>{u.materias_aprobadas}</span>
              </Td>
              <Td style={rowActiveStyle}>
                <span style={{
                  fontSize:12, padding:'3px 8px', borderRadius:4, fontWeight:600,
                  background: editando ? 'rgba(255,255,255,.16)' : horas>=500 ? 'rgba(34,199,138,.15)' : 'rgba(10,27,78,.08)',
                  color: editando ? '#fff' : horas>=500 ? 'var(--green)' : 'var(--text2)'
                }}>{horas}h</span>
              </Td>
              <Td style={rowActiveStyle}>
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
                            border: editando ? '1px solid rgba(111,224,184,.85)' : '1px solid rgba(15,158,110,.30)',
                            background: editando ? 'rgba(111,224,184,.24)' : 'rgba(15,158,110,.10)',
                            color: editando ? '#b8ffe6' : 'var(--green)',
                            borderRadius:6,
                            padding:'6px 9px',
                            fontFamily:'inherit',
                            fontSize:12,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? .55 : 1
                          }}
                        >
                          {saving ? 'Guardando...' : 'Acreditar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelarHoras(u)}
                          disabled={saving}
                          style={{
                            border: editando ? '1px solid rgba(255,255,255,.45)' : '1px solid rgba(10,27,78,.18)',
                            background:'none',
                            color: editando ? '#fff' : 'var(--text2)',
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
                          border:'1px solid rgba(15,158,110,.30)',
                          background:'rgba(15,158,110,.10)',
                          color:'var(--green)',
                          borderRadius:6,
                          padding:'6px 9px',
                          fontFamily:'inherit',
                          fontSize:12,
                          cursor:'pointer'
                        }}
                      >
                        Acreditar
                      </button>
                    )}
                  </div>
                ) : (
                  <span style={{ color:'var(--text3)' }}>—</span>
                )}
              </Td>
              <Td style={rowActiveStyle}>
                {editando ? (
                  <span style={{
                    fontSize:12,
                    padding:'3px 10px',
                    borderRadius:999,
                    fontWeight:700,
                    background:'rgba(255,255,255,.16)',
                    color:'#fff'
                  }}>
                    {u.rol}
                  </span>
                ) : (
                  <Badge type={u.rol}>{u.rol}</Badge>
                )}
              </Td>
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
      <Modal
        open={!!confirmacionHoras}
        onClose={() => {
          if (!savingHorasId) setConfirmacionHoras(null);
        }}
        title="Acreditar horas"
        width={440}
        footer={(
          <>
            <button
              type="button"
              onClick={() => setConfirmacionHoras(null)}
              disabled={!!savingHorasId}
              style={{
                border:'1px solid rgba(10,27,78,.18)',
                background:'none',
                color:'var(--text2)',
                borderRadius:6,
                padding:'8px 14px',
                fontFamily:'inherit',
                fontSize:13,
                cursor: savingHorasId ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={guardarHorasConfirmadas}
              disabled={!!savingHorasId}
              style={{
                border:'1px solid rgba(15,158,110,.30)',
                background:'rgba(15,158,110,.10)',
                color:'var(--green)',
                borderRadius:6,
                padding:'8px 14px',
                fontFamily:'inherit',
                fontSize:13,
                fontWeight:600,
                cursor: savingHorasId ? 'not-allowed' : 'pointer',
                opacity: savingHorasId ? .55 : 1
              }}
            >
              {savingHorasId ? 'Acreditando...' : 'Aceptar'}
            </button>
          </>
        )}
      >
        <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.6 }}>
          ¿Estas seguro de acreditar <strong style={{ color:'var(--text)' }}>{confirmacionHoras?.horas || 0} horas</strong> a{' '}
          <strong style={{ color:'var(--text)' }}>{confirmacionHoras?.usuario?.nombre_completo}</strong>?
        </p>
      </Modal>
      <Toast toast={toast} />
    </>
  );
}

