import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  PageHeader, Btn, Tag, Badge,
  Modal, Field, Input, Select, Textarea, Spinner, useToast, Toast, EmptyState
} from '../components/UI';

const EMPTY_FORM = {
  titulo:'', descripcion:'', ubicacion:'', horario:'',
  horas_acreditar:150, cupo_maximo:5, id_carrera:'', imagen_url:'', activo:true
};
const MIN_MATERIAS_APROBADAS = 30;

export default function Ofertas() {
  const { user } = useAuth();
  const isAdmin  = user?.rol === 'admin';

  const [ofertas,   setOfertas]   = useState([]);
  const [carreras,  setCarreras]  = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [carreraFiltro, setCarreraFiltro] = useState('');
  const [modal,     setModal]     = useState(false);
  const [detModal,  setDetModal]  = useState(null);
  const [adminDetModal, setAdminDetModal] = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const { toast, show } = useToast();

  async function load() {
    try {
      const [o, c, i] = await Promise.all([
        api.get('/ofertas'),
        api.get('/carreras'),
        api.get('/inscripciones')
      ]);
      setOfertas(o.data);
      setCarreras(c.data);
      setInscripciones(i.data);
    } catch { show('Error al cargar', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew()   { setForm(EMPTY_FORM); setEditId(null); setModal(true); }
  function openEdit(o) {
    setForm({
      titulo: o.titulo, descripcion: o.descripcion, ubicacion: o.ubicacion||'',
      horario: o.horario||'', horas_acreditar: o.horas_acreditar,
      cupo_maximo: o.cupo_maximo, id_carrera: o.id_carrera||'',
      imagen_url: o.imagen_url||'', activo: o.activo
    });
    setEditId(o.id_oferta);
    setModal(true);
  }

  async function saveOferta() {
    if (!form.titulo || !form.descripcion) { show('Título y descripción requeridos','error'); return; }
    setSaving(true);
    try {
      const body = { ...form, id_carrera: form.id_carrera || null };
      if (editId) await api.put(`/ofertas/${editId}`, body);
      else        await api.post('/ofertas', body);
      show(editId ? 'Oferta actualizada' : 'Oferta creada');
      setModal(false);
      load();
    } catch (e) { show(e.response?.data?.error || 'Error al guardar','error'); }
    finally { setSaving(false); }
  }

  async function toggleOferta(id) {
    try { await api.patch(`/ofertas/${id}/toggle`); show('Estado actualizado'); load(); }
    catch { show('Error','error'); }
  }

  async function openAdminDetalle(o) {
    setAdminDetModal(o);
    try {
      const { data } = await api.get('/inscripciones');
      setInscripciones(data);
    } catch {
      show('Error al cargar inscritos', 'error');
    }
  }

  async function acreditarHoras(inscripcionId, horas) {
    try {
      await api.patch(`/inscripciones/${inscripcionId}/horas`, { horas_acreditadas: horas });
      show('Horas acreditadas');
      const [{ data: nuevasInscripciones }, { data: nuevasOfertas }] = await Promise.all([
        api.get('/inscripciones'),
        api.get('/ofertas')
      ]);
      setInscripciones(nuevasInscripciones);
      setOfertas(nuevasOfertas);
    } catch (e) {
      show(e.response?.data?.error || 'Error al acreditar horas', 'error');
    }
  }

  async function eliminarInscripcion(inscripcionId) {
    try {
      await api.delete(`/inscripciones/${inscripcionId}`);
      show('Inscripción eliminada');
      const [{ data: nuevasInscripciones }, { data: nuevasOfertas }] = await Promise.all([
        api.get('/inscripciones'),
        api.get('/ofertas')
      ]);
      setInscripciones(nuevasInscripciones);
      setOfertas(nuevasOfertas);
    } catch (e) {
      show(e.response?.data?.error || 'Error al eliminar inscripción', 'error');
    }
  }

  async function inscribirse(id) {
    try {
      await api.post('/inscripciones', { id_oferta: id });
      show('¡Inscripción realizada! Estado: pendiente');
      setDetModal(null);
      load();
    } catch (e) { show(e.response?.data?.error || 'Error','error'); }
  }

  async function desuscribirse(inscripcionId) {
    const confirmar = window.confirm('¿Quieres desuscribirte de esta oferta?');
    if (!confirmar) return;

    try {
      await api.delete(`/inscripciones/${inscripcionId}`);
      show('Te desuscribiste de la oferta');
      load();
    } catch (e) {
      show(e.response?.data?.error || 'Error al desuscribirse', 'error');
    }
  }

  const filtered = ofertas.filter(o => {
    const coincideQuery   = !query || o.titulo.toLowerCase().includes(query.toLowerCase());
    const coincideFiltroCarrera =
      !carreraFiltro ||
      (carreraFiltro === 'general' && !o.id_carrera) ||
      String(o.id_carrera || '') === carreraFiltro;
    const coincideCarrera = isAdmin || !o.id_carrera || o.id_carrera === user?.id_carrera;
    return coincideQuery && coincideFiltroCarrera && coincideCarrera;
  });

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader
        title={isAdmin ? 'Gestión de ofertas' : 'Ofertas disponibles'}
        subtitle={isAdmin ? 'Crea, edita y administra las plazas disponibles' : 'Plazas abiertas para tu carrera y el sistema general'}
      />

      {isAdmin && (
        <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1 }}>
            <span style={{
              position:'absolute',
              left:12,
              top:'50%',
              transform:'translateY(-50%)',
              fontSize:14,
              color:'#8d97b8'
            }}>⌕</span>
            <input
              value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="Buscar oferta..."
              style={{ width:'100%', background:'#fff', border:'1px solid rgba(10,27,78,.15)', borderRadius:8, padding:'9px 14px 9px 34px', fontFamily:'inherit', fontSize:13, color:'var(--text)', outline:'none', boxShadow:'0 1px 3px rgba(10,27,78,.06)' }}
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
              boxShadow:'0 1px 3px rgba(10,27,78,.06)',
              minWidth:220
            }}
          >
            <option value="">Todas las carreras</option>
            {carreras.map(c => <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>)}
          </select>
          <Btn variant="accent" onClick={openNew}>+ Nueva oferta</Btn>
        </div>
      )}

      {/* ADMIN CARDS */}
      {isAdmin && (
        filtered.length === 0
          ? <EmptyState msg="Sin ofertas registradas." />
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
              {filtered.map(o => (
                <AdminOfertaCard
                  key={o.id_oferta}
                  o={o}
                  onOpen={() => openAdminDetalle(o)}
                  onEdit={() => openEdit(o)}
                  onToggle={() => toggleOferta(o.id_oferta)}
                />
              ))}
            </div>
      )}

      {/* STUDENT CARDS */}
      {!isAdmin && (
        filtered.length === 0
          ? <EmptyState msg="No hay ofertas disponibles en este momento." />
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
              {filtered.map(o => {
                const inscripcion = inscripciones.find(i => i.id_oferta === o.id_oferta);
                return (
                  <OfertaCard
                    key={o.id_oferta}
                    o={o}
                    user={user}
                    inscripcion={inscripcion}
                    onDesuscribir={() => desuscribirse(inscripcion.id_inscripcion)}
                    onVer={() => setDetModal(o)}
                  />
                );
              })}
            </div>
      )}

      {/* MODAL FORM (admin) */}
      <Modal open={modal} onClose={() => setModal(false)}
        title={editId ? 'Editar oferta' : 'Nueva oferta'}
        footer={<>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn variant="accent"  onClick={saveOferta} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Btn>
        </>}
      >
        <Field label="Título"><Input value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} placeholder="Ej. Apoyo Comunitario en TI" /></Field>
        <Field label="Descripción"><Textarea value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} /></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Ubicación"><Input value={form.ubicacion} onChange={e=>setForm({...form,ubicacion:e.target.value})} placeholder="Campus Central" /></Field>
          <Field label="Horario"><Input value={form.horario} onChange={e=>setForm({...form,horario:e.target.value})} placeholder="Lunes a Viernes" /></Field>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Horas a acreditar"><Input type="number" value={form.horas_acreditar} onChange={e=>setForm({...form,horas_acreditar:+e.target.value})} min={1} /></Field>
          <Field label="Cupo máximo"><Input type="number" value={form.cupo_maximo} onChange={e=>setForm({...form,cupo_maximo:+e.target.value})} min={1} /></Field>
        </div>
        <Field label="Carrera (opcional)">
          <Select value={form.id_carrera} onChange={e=>setForm({...form,id_carrera:e.target.value})}>
            <option value="">Todas las carreras</option>
            {carreras.map(c => <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>)}
          </Select>
        </Field>
        <Field label="URL de imagen (opcional)"><Input value={form.imagen_url} onChange={e=>setForm({...form,imagen_url:e.target.value})} placeholder="https://..." /></Field>
      </Modal>

      {adminDetModal && (
        <AdminInscritosModal
          o={adminDetModal}
          inscritos={inscripciones.filter(i => i.id_oferta === adminDetModal.id_oferta && i.estado !== 'rechazado')}
          onClose={() => setAdminDetModal(null)}
          onAcreditar={acreditarHoras}
          onEliminar={eliminarInscripcion}
        />
      )}

      {/* MODAL DETALLE (estudiante) */}
      {detModal && (
        <DetalleModal o={detModal} user={user} onClose={() => setDetModal(null)} onInscribir={inscribirse} />
      )}

      <Toast toast={toast} />
    </>
  );
}

function AdminOfertaCard({ o, onOpen, onEdit, onToggle }) {
  const pct = o.cupo_maximo > 0 ? Math.round((o.cupo_actual/o.cupo_maximo)*100) : 0;
  const barColor = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--amber)' : 'var(--green)';

  return (
    <div style={{
      background:'#fff',
      border:'1px solid rgba(10,27,78,.10)',
      borderRadius:'var(--radius)',
      overflow:'hidden',
      boxShadow:'0 1px 4px rgba(10,27,78,.06)',
      display:'flex',
      flexDirection:'column',
      minHeight:'100%',
      cursor:'pointer',
      transition:'border-color .2s, box-shadow .2s, transform .2s'
    }}
      onClick={onOpen}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(10,27,78,.22)';e.currentTarget.style.boxShadow='0 4px 16px rgba(10,27,78,.10)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(10,27,78,.10)';e.currentTarget.style.boxShadow='0 1px 4px rgba(10,27,78,.06)';e.currentTarget.style.transform='translateY(0)'}}
    >
      {o.imagen_url
        ? <img src={o.imagen_url} alt={o.titulo} style={{ width:'100%', height:150, objectFit:'cover' }} onError={e=>e.currentTarget.style.display='none'} />
        : <div style={{ width:'100%', height:150, background:'linear-gradient(135deg,#e8eaf2 0%,#d0d5ea 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>SS</div>
      }

      <div style={{ padding:16, display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:8 }}>
          <div style={{ fontSize:16, fontWeight:700, lineHeight:1.35, color:'var(--text)' }}>{o.titulo}</div>
          <Badge type={o.activo ? 'active' : 'inactive'}>{o.activo ? 'Activo' : 'Inactivo'}</Badge>
        </div>

        <div style={{
          fontSize:13,
          color:'var(--text2)',
          lineHeight:1.6,
          marginBottom:12,
          display:'-webkit-box',
          WebkitLineClamp:2,
          WebkitBoxOrient:'vertical',
          overflow:'hidden'
        }}>
          {o.descripcion}
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
          <Tag color="blue">{o.horas_acreditar}h</Tag>
          {o.horario && <Tag color="gray">{o.horario}</Tag>}
          {o.ubicacion && <Tag color="gray">{o.ubicacion}</Tag>}
          {o.nombre_carrera ? <Tag color="green">{o.nombre_carrera}</Tag> : <Tag color="amber">Todas las carreras</Tag>}
        </div>

        <div style={{ paddingTop:12, borderTop:'1px solid rgba(10,27,78,.08)', marginTop:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:10, fontSize:12, color:'var(--text3)', marginBottom:6 }}>
            <span>{o.cupo_actual}/{o.cupo_maximo} inscritos</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height:5, background:'#e8eaf2', borderRadius:3, marginBottom:14 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:3 }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <Btn variant="outline" onClick={e => { e.stopPropagation(); onEdit(); }}>Editar</Btn>
            <Btn variant={o.activo ? 'danger' : 'green'} onClick={e => { e.stopPropagation(); onToggle(); }}>
              {o.activo ? 'Desactivar' : 'Activar'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminInscritosModal({ o, inscritos, onClose, onAcreditar, onEliminar }) {
  const [query, setQuery] = useState('');
  const inscritosKey = inscritos
    .map(i => `${i.id_inscripcion}:${i.horas_acreditadas ?? ''}:${i.horas_acreditar ?? ''}`)
    .join('|');
  const [horasPorInscripcion, setHorasPorInscripcion] = useState(() =>
    Object.fromEntries(inscritos.map(i => [
      i.id_inscripcion,
      i.horas_acreditadas ?? i.horas_acreditar ?? o.horas_acreditar
    ]))
  );

  useEffect(() => {
    setHorasPorInscripcion(Object.fromEntries(inscritos.map(i => [
      i.id_inscripcion,
      i.horas_acreditadas ?? i.horas_acreditar ?? o.horas_acreditar
    ])));
  }, [inscritosKey, o.horas_acreditar]);

  function setHoras(id, value) {
    setHorasPorInscripcion(prev => ({ ...prev, [id]: value }));
  }

  const inscritosFiltrados = inscritos.filter(i => {
    const carrera = i.nombre_carrera || i.carrera || i.estudiante_carrera || '';
    const texto = `${i.estudiante_nombre} ${i.correo_institucional} ${carrera}`.toLowerCase();
    return !query || texto.includes(query.trim().toLowerCase());
  });

  return (
    <Modal open title={`Inscritos en ${o.titulo}`} onClose={onClose} width={760}
      footer={<Btn variant="outline" onClick={onClose}>Cerrar</Btn>}
    >
      <div style={{ fontSize:13, color:'var(--text2)', marginBottom:16 }}>
        {inscritos.length}/{o.cupo_maximo} estudiantes inscritos
      </div>

      <div style={{ position:'relative', marginBottom:14 }}>
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
          placeholder="Buscar alumno..."
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

      {inscritos.length === 0 ? (
        <EmptyState msg="Aún no hay estudiantes inscritos en esta oferta." />
      ) : inscritosFiltrados.length === 0 ? (
        <EmptyState msg="No hay alumnos que coincidan con la búsqueda." />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {inscritosFiltrados.map(i => {
            const horasAcreditadas = i.estado === 'finalizado' || i.horas_acreditadas !== null && i.horas_acreditadas !== undefined;
            return (
            <div key={i.id_inscripcion} style={{
              border:'1px solid rgba(10,27,78,.10)',
              borderRadius:10,
              padding:'12px 14px',
              background:'var(--bg)'
            }}>
              <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) auto', alignItems:'center', gap:14 }}>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {i.estudiante_nombre}
                  </div>
                  <div style={{
                    display:'flex',
                    alignItems:'center',
                    gap:8,
                    flexWrap:'wrap',
                    fontSize:12,
                    marginTop:4,
                    minWidth:0
                  }}>
                    <span style={{ color:'var(--text3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {i.correo_institucional}
                    </span>
                    <span style={{ color:'var(--text3)' }}>•</span>
                    <span style={{ color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {i.nombre_carrera || i.carrera || i.estudiante_carrera || 'Carrera no asignada'}
                    </span>
                  </div>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
                  <Badge type={i.estado}>{i.estado}</Badge>
                  <input
                    type="number"
                    min="0"
                    max={i.horas_oferta || o.horas_acreditar}
                    value={horasPorInscripcion[i.id_inscripcion] ?? ''}
                    disabled={i.estado !== 'aceptado'}
                    onChange={e => setHoras(i.id_inscripcion, e.target.value)}
                    title="Horas a acreditar"
                    style={{
                      width:70,
                      background: i.estado === 'aceptado' ? '#fff' : 'rgba(10,27,78,.04)',
                      border:'1px solid var(--border2)',
                      borderRadius:6,
                      padding:'6px 8px',
                      fontFamily:'inherit',
                      fontSize:12,
                      color: i.estado === 'aceptado' ? 'var(--text)' : 'var(--text3)',
                      cursor: i.estado === 'aceptado' ? 'text' : 'not-allowed'
                    }}
                  />
                  <Btn
                    variant="green"
                    onClick={() => onAcreditar(i.id_inscripcion, horasPorInscripcion[i.id_inscripcion])}
                    disabled={i.estado !== 'aceptado'}
                    style={{ padding:'6px 10px' }}
                  >
                    Acreditar
                  </Btn>
                  <button
                    type="button"
                    onClick={() => onEliminar(i.id_inscripcion)}
                    disabled={horasAcreditadas}
                    title={horasAcreditadas ? 'No se puede eliminar una inscripción con horas acreditadas' : 'Eliminar inscripción'}
                    style={{
                      width:30,
                      height:30,
                      borderRadius:6,
                      border: horasAcreditadas ? '1px solid rgba(10,27,78,.12)' : '1px solid rgba(217,48,37,.30)',
                      background: horasAcreditadas ? 'rgba(10,27,78,.04)' : 'none',
                      color: horasAcreditadas ? 'var(--text3)' : '#b52920',
                      fontSize:16,
                      fontWeight:700,
                      cursor: horasAcreditadas ? 'not-allowed' : 'pointer',
                      opacity: horasAcreditadas ? .65 : 1,
                      lineHeight:1
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </Modal>
  );
}

function OfertaCard({ o, user, inscripcion, onVer, onDesuscribir }) {
  const pct = o.cupo_maximo > 0 ? Math.round((o.cupo_actual/o.cupo_maximo)*100) : 0;
  const barColor = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--amber)' : 'var(--green)';
  const isMyCarrera = o.id_carrera && o.id_carrera === user?.id_carrera;
  const tieneAcceso = (user?.materias ?? user?.materias_aprobadas ?? 0) >= MIN_MATERIAS_APROBADAS;
  const estaInscrito = Boolean(inscripcion);
  const estaPendiente = inscripcion?.estado === 'pendiente';
  const estaAceptado = inscripcion?.estado === 'aceptado';
  const estaFinalizado = inscripcion?.estado === 'finalizado';
  const estaRechazado = inscripcion?.estado === 'rechazado';
  const cupoLleno = o.cupo_actual >= o.cupo_maximo;
  const bloqueado = estaInscrito || cupoLleno || !tieneAcceso;
  const textoBoton = estaPendiente
    ? 'Pendiente'
    : estaAceptado
      ? 'En curso'
      : estaFinalizado
        ? 'Finalizado'
        : estaRechazado
          ? 'Rechazado'
          : !tieneAcceso
            ? 'Sin acceso'
            : cupoLleno
              ? 'Cupo máximo alcanzado'
              : 'Inscribirme';

  return (
    <div style={{
      background:'#fff', border:'1px solid rgba(10,27,78,.10)', borderRadius:'var(--radius)',
      overflow:'hidden', cursor:'pointer', transition:'border-color .2s, box-shadow .2s, transform .2s',
      boxShadow: '0 1px 4px rgba(10,27,78,.06)'
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(10,27,78,.22)';e.currentTarget.style.boxShadow='0 4px 16px rgba(10,27,78,.10)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(10,27,78,.10)';e.currentTarget.style.boxShadow='0 1px 4px rgba(10,27,78,.06)';e.currentTarget.style.transform='translateY(0)'}}
    >
      {o.imagen_url
        ? <img src={o.imagen_url} alt={o.titulo} style={{ width:'100%', height:140, objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
        : <div style={{ width:'100%', height:140, background:'linear-gradient(135deg,#e8eaf2 0%,#d0d5ea 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>SS</div>
      }
      <div style={{ padding:16 }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:6, lineHeight:1.4, color:'var(--text)' }}>{o.titulo}</div>
        <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6, marginBottom:12,
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {o.descripcion}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
          <Tag color="blue">{o.horas_acreditar}h</Tag>
          {o.horario  && <Tag color="gray">{o.horario}</Tag>}
          {o.ubicacion && <Tag color="gray">{o.ubicacion}</Tag>}
          {isMyCarrera && <Tag color="green">{o.nombre_carrera || 'Carrera asignada'}</Tag>}
          {!o.id_carrera && <Tag color="amber">Todas las carreras</Tag>}
        </div>
        <div style={{ paddingTop:12, borderTop:'1px solid rgba(10,27,78,.08)' }}>
          <div style={{ fontSize:11, color:'var(--text3)', marginBottom:6 }}>{o.cupo_actual}/{o.cupo_maximo} inscritos</div>
          <div style={{ height:4, background:'#e8eaf2', borderRadius:2, marginBottom:14 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:2 }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns: estaPendiente ? '1fr 1fr' : '1fr', gap:8 }}>
            <button disabled={bloqueado} onClick={e=>{e.stopPropagation(); if (!bloqueado) onVer();}} style={{
            width:'100%', minHeight:42,
            background: estaInscrito ? 'rgba(15,158,110,.10)' : cupoLleno ? 'rgba(217,48,37,.08)' : !tieneAcceso ? 'rgba(10,27,78,.06)' : 'none',
            border: estaInscrito ? '1px solid rgba(15,158,110,.25)' : cupoLleno ? '1px solid rgba(217,48,37,.22)' : !tieneAcceso ? '1px solid rgba(10,27,78,.12)' : '1px solid rgba(10,27,78,.20)',
            borderRadius:7, padding:'9px', fontFamily:'inherit', fontSize:13,
            fontWeight:600,
            color: estaInscrito ? 'var(--green)' : cupoLleno ? '#b52920' : !tieneAcceso ? 'var(--text3)' : '#0A1B4E',
            cursor: bloqueado ? 'not-allowed' : 'pointer',
            opacity: bloqueado ? .85 : 1,
            transition:'.15s'
          }}
            onMouseEnter={e=>{ if (!bloqueado) { e.currentTarget.style.background='#0A1B4E'; e.currentTarget.style.color='#fff'; } }}
            onMouseLeave={e=>{ if (!bloqueado) { e.currentTarget.style.background='none'; e.currentTarget.style.color='#0A1B4E'; } }}
          >
            {textoBoton}
            </button>
            {estaPendiente && (
              <button onClick={e=>{e.stopPropagation(); onDesuscribir();}} style={{
                width:'100%',
                minHeight:42,
                background:'rgba(217,48,37,.08)',
                border:'1px solid rgba(217,48,37,.30)',
                borderRadius:7,
                padding:'9px',
                fontFamily:'inherit',
                fontSize:13,
                fontWeight:600,
                color:'#b52920',
                cursor:'pointer',
                transition:'.15s'
              }}>
                Desuscribirme
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetalleModal({ o, user, onClose, onInscribir }) {
  const pct = o.cupo_maximo > 0 ? Math.round((o.cupo_actual/o.cupo_maximo)*100) : 0;
  const isFull = o.cupo_actual >= o.cupo_maximo;
  const tieneAcceso = (user?.materias ?? user?.materias_aprobadas ?? 0) >= MIN_MATERIAS_APROBADAS;

  return (
    <Modal open title={o.titulo} onClose={onClose}
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cerrar</Btn>
        {!isFull && tieneAcceso && <Btn variant="accent" onClick={() => onInscribir(o.id_oferta)}>Inscribirme</Btn>}
        {!isFull && !tieneAcceso && <Btn variant="outline" disabled>Sin acceso</Btn>}
        {isFull  && <Btn variant="outline" disabled>Cupo máximo alcanzado</Btn>}
      </>}
    >
      {o.imagen_url && <img src={o.imagen_url} alt={o.titulo} style={{ width:'100%', height:180, objectFit:'cover', borderRadius:8, marginBottom:16 }} onError={e=>e.target.style.display='none'} />}
      <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.7, marginBottom:16 }}>{o.descripcion}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {[['Ubicación', o.ubicacion||'-'], ['Horario', o.horario||'-'], ['Horas', o.horas_acreditar+'h'], ['Carrera', o.nombre_carrera||'Todas']].map(([l,v]) => (
          <div key={l}>
            <div style={{ fontSize:11, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:14, fontWeight:500, color:'var(--text)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:12, color:'var(--text3)', marginBottom:4 }}>Cupo: {o.cupo_actual}/{o.cupo_maximo}</div>
      <div style={{ height:6, background:'#e8eaf2', borderRadius:3 }}>
        <div style={{ height:'100%', width:`${pct}%`, background: pct>80?'var(--red)':pct>50?'var(--amber)':'var(--green)', borderRadius:3 }} />
      </div>
    </Modal>
  );
}
