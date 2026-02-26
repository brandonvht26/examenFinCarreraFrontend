import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioTicket = () => {
    const [ticket, setTicket] = useState({ codigo: '', descripcion: '', cliente: '', tecnico: '' })
    const [listaClientes, setListaClientes] = useState([])
    const [listaTecnicos, setListaTecnicos] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        Promise.all([clienteAxios.get('/clientes'), clienteAxios.get('/tecnicos')])
            .then(([rc, rt]) => { setListaClientes(rc.data); setListaTecnicos(rt.data) })
            .catch(() => Swal.fire('Error', 'No se pudieron cargar los directorios del sistema', 'error'))
    }, [])

    useEffect(() => {
        if (id) {
            clienteAxios.get(`/ticket/${id}`).then(({ data }) => {
                setTicket({ codigo: data.codigo, descripcion: data.descripcion, cliente: data.cliente?._id || '', tecnico: data.tecnico?._id || '' })
            }).catch(() => { Swal.fire('Error', 'No se pudo cargar la información del ticket', 'error'); navigate('/dashboard/tickets') })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleChange = (e) => setTicket({ ...ticket, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(ticket).includes('')) { Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning'); return }
        try {
            if (id) { await clienteAxios.put(`/ticket/${id}`, ticket); Swal.fire('¡Actualizado!', 'La orden de trabajo se actualizó correctamente', 'success') }
            else { await clienteAxios.post('/tickets', ticket); Swal.fire('¡Ticket Creado!', 'El incidente ha sido registrado y asignado', 'success') }
            navigate('/dashboard/tickets')
        } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error en el servidor', 'error') }
    }

    const clienteSeleccionado = listaClientes.find(c => c._id === ticket.cliente)
    const tecnicoSeleccionado  = listaTecnicos.find(t => t._id === ticket.tecnico)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                .ftk-page { font-family:'DM Sans',sans-serif; }
                .ftk-card { background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.07);max-width:760px;margin:0 auto;overflow:hidden; }
                .ftk-head { background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);padding:1.75rem 2rem;border-bottom:3px solid #3B82F6; }
                .ftk-head p { font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#60A5FA;margin-bottom:0.3rem; }
                .ftk-head h1 { font-family:'Syne',sans-serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:700;color:#fff; }
                .ftk-body { padding:2rem;display:flex;flex-direction:column;gap:1.25rem; }
                .ftk-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1.1rem; }
                .ftk-label { display:block;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;margin-bottom:0.4rem; }
                .ftk-label.accent { color:#2563EB; }
                .ftk-input, .ftk-select, .ftk-textarea { width:100%;padding:0.8rem 1rem;border:1.5px solid #E2E8F0;border-radius:10px;background:#F8FAFC;color:#0F172A;font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;box-sizing:border-box; }
                .ftk-input:focus, .ftk-select:focus, .ftk-textarea:focus { border-color:#3B82F6;background:#EFF6FF;box-shadow:0 0 0 3px rgba(59,130,246,0.15); }
                .ftk-input:disabled { background:#F1F5F9;color:#94A3B8;cursor:not-allowed; }
                .ftk-input.upper { text-transform:uppercase; }
                .ftk-textarea { resize:vertical;min-height:100px; }

                /* Resumen */
                .ftk-summary { background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1.5px solid #BFDBFE;border-radius:12px;padding:1.25rem; }
                .ftk-summary-title { font-size:0.67rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1E40AF;margin-bottom:0.85rem; }
                .ftk-summary-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
                .ftk-s-label { font-size:0.68rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px; }
                .ftk-s-name  { font-weight:700;color:#0F172A;font-size:0.875rem;margin-top:0.1rem; }
                .ftk-s-sub   { font-size:0.75rem;color:#64748B;margin-top:0.1rem; }

                .ftk-footer { display:flex;gap:1rem;flex-wrap:wrap;padding:1.5rem 2rem;background:#F8FAFC;border-top:1px solid #F1F5F9; }
                .ftk-submit { flex:1;min-width:160px;padding:0.875rem 1rem;background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff;font-family:'DM Sans',sans-serif;font-weight:800;font-size:0.9rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(29,78,216,0.3);transition:transform 0.15s,box-shadow 0.15s; }
                .ftk-submit:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(29,78,216,0.4); }
                .ftk-cancel { flex:1;min-width:140px;padding:0.875rem 1rem;background:#fff;color:#334155;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.9rem;border:1.5px solid #CBD5E1;border-radius:10px;cursor:pointer;transition:background 0.15s; }
                .ftk-cancel:hover { background:#F1F5F9; }
                @media (max-width:560px) { .ftk-grid-2 { grid-template-columns:1fr; } .ftk-summary-grid { grid-template-columns:1fr; } .ftk-body { padding:1.25rem; } .ftk-footer { padding:1.25rem; } }
            `}</style>

            <div className="ftk-page">
                <div className="ftk-card">
                    <div className="ftk-head">
                        <p>{id ? 'Modificación' : 'Emisión'} · Tickets</p>
                        <h1>{id ? 'Modificar Orden de Trabajo' : 'Generar Nuevo Ticket'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="ftk-body">
                            {/* Código */}
                            <div style={{maxWidth:'340px'}}>
                                <label className="ftk-label">Código del Ticket *</label>
                                <input type="text" name="codigo" value={ticket.codigo} onChange={handleChange}
                                    className="ftk-input upper" placeholder="Ej: TCK-1001" disabled={!!id} />
                            </div>

                            {/* Selects */}
                            <div>
                                <label className="ftk-label accent">Solicitante (Empleado) *</label>
                                <select name="cliente" value={ticket.cliente} onChange={handleChange} className="ftk-select">
                                    <option value="">-- Busque un solicitante en el directorio --</option>
                                    {listaClientes.map(c => (
                                        <option key={c._id} value={c._id}>{c.cedula} - {c.nombre} {c.apellido} ({c.dependencia})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="ftk-label accent">Asignar a Técnico *</label>
                                <select name="tecnico" value={ticket.tecnico} onChange={handleChange} className="ftk-select">
                                    <option value="">-- Seleccione un técnico de la cuadrilla --</option>
                                    {listaTecnicos.map(t => (
                                        <option key={t._id} value={t._id}>{t.cedula} - {t.nombre} {t.apellido}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="ftk-label">Descripción del Incidente *</label>
                                <textarea name="descripcion" value={ticket.descripcion} onChange={handleChange}
                                    className="ftk-textarea" placeholder="Describa detalladamente el problema reportado..." />
                            </div>

                            {/* Resumen */}
                            {clienteSeleccionado && tecnicoSeleccionado && (
                                <div className="ftk-summary">
                                    <p className="ftk-summary-title">Resumen de la Orden</p>
                                    <div className="ftk-summary-grid">
                                        <div>
                                            <p className="ftk-s-label">Solicitante</p>
                                            <p className="ftk-s-name">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
                                            <p className="ftk-s-sub">Área: {clienteSeleccionado.dependencia}</p>
                                        </div>
                                        <div>
                                            <p className="ftk-s-label">Técnico Asignado</p>
                                            <p className="ftk-s-name">{tecnicoSeleccionado.nombre} {tecnicoSeleccionado.apellido}</p>
                                            <p className="ftk-s-sub">{tecnicoSeleccionado.telefono}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="ftk-footer">
                            <button type="submit" className="ftk-submit">{id ? 'Guardar Cambios' : 'Emitir Ticket'}</button>
                            <button type="button" className="ftk-cancel" onClick={() => navigate('/dashboard/tickets')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioTicket