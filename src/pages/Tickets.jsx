import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const tableStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    .pg-wrap { font-family:'DM Sans',sans-serif; }
    .pg-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #BFDBFE; }
    .pg-title { font-size:clamp(1.4rem,3vw,1.9rem);font-weight:800;color:#0F172A; }
    .pg-title span { display:block;font-size:0.72rem;font-weight:500;color:#94A3B8;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:0.1rem; }
    .pg-btn-add { display:inline-flex;align-items:center;gap:0.4rem;background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.875rem;padding:0.65rem 1.25rem;border-radius:10px;text-decoration:none;box-shadow:0 4px 14px rgba(29,78,216,0.3);transition:transform 0.15s,box-shadow 0.15s;white-space:nowrap; }
    .pg-btn-add:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(29,78,216,0.4); }
    .pg-card { background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;border:1px solid #E2E8F0; }
    .pg-tbl-wrap { overflow-x:auto; }
    .pg-tbl { width:100%;border-collapse:collapse;min-width:580px; }
    .pg-tbl thead tr { background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%); }
    .pg-tbl thead th { padding:1rem 1.1rem;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.6);white-space:nowrap; }
    .pg-tbl thead th:first-child { color:#60A5FA; }
    .pg-tbl tbody tr { border-bottom:1px solid #F1F5F9;transition:background 0.15s; }
    .pg-tbl tbody tr:last-child { border-bottom:none; }
    .pg-tbl tbody tr:hover { background:#EFF6FF; }
    .pg-tbl tbody td { padding:0.9rem 1.1rem;font-size:0.875rem;color:#334155; }
    .pg-tkt-code { font-weight:800;font-size:0.8rem;color:#2563EB;text-transform:uppercase; }
    .pg-name { font-weight:600;color:#0F172A; }
    .pg-sub  { color:#94A3B8;font-size:0.75rem;margin-top:1px; }
    .pg-desc { color:#64748B;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
    .pg-edit { color:#2563EB;font-weight:700;font-size:0.85rem;text-decoration:none;padding:0.3rem 0.65rem;border-radius:6px;transition:background 0.15s; }
    .pg-edit:hover { background:#DBEAFE; }
    .pg-del { color:#EF4444;font-weight:700;font-size:0.85rem;background:none;border:none;cursor:pointer;padding:0.3rem 0.65rem;border-radius:6px;font-family:'DM Sans',sans-serif;transition:background 0.15s; }
    .pg-del:hover { background:#FEE2E2; }
    .pg-empty td { padding:3rem 1rem;text-align:center;color:#94A3B8;font-size:0.875rem; }
`

const Tickets = () => {
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        clienteAxios.get('/tickets').then(({ data }) => setTickets(data)).catch(console.log)
    }, [])

    const handleEliminar = async (id) => {
        const ok = await Swal.fire({
            title: '¿Anular Ticket?', text: 'Esta orden de trabajo será eliminada permanentemente del sistema.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#1D4ED8',
            cancelButtonColor: '#64748B', confirmButtonText: 'Sí, anular', cancelButtonText: 'Cancelar'
        })
        if (ok.isConfirmed) {
            try {
                await clienteAxios.delete(`/ticket/${id}`)
                setTickets(tickets.filter(t => t._id !== id))
                Swal.fire('¡Anulado!', 'El ticket ha sido eliminado.', 'success')
            } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error al eliminar', 'error') }
        }
    }

    return (
        <>
            <style>{tableStyles}</style>
            <div className="pg-wrap">
                <div className="pg-header">
                    <div className="pg-title"><span>Módulo</span>Gestión de Tickets de Soporte</div>
                    <Link to="/dashboard/tickets/crear" className="pg-btn-add">+ Generar Nuevo Ticket</Link>
                </div>
                <div className="pg-card">
                    <div className="pg-tbl-wrap">
                        <table className="pg-tbl">
                            <thead><tr>
                                <th>Nº Ticket</th><th>Solicitante</th>
                                <th>Técnico Asignado</th><th>Descripción</th>
                                <th style={{textAlign:'center'}}>Acciones</th>
                            </tr></thead>
                            <tbody>
                                {tickets.map(t => (
                                    <tr key={t._id}>
                                        <td><span className="pg-tkt-code">{t.codigo}</span></td>
                                        <td>
                                            <p className="pg-name">{t.cliente?.nombre} {t.cliente?.apellido}</p>
                                            <p className="pg-sub">Área: {t.cliente?.dependencia}</p>
                                        </td>
                                        <td>
                                            <p className="pg-name">{t.tecnico?.nombre} {t.tecnico?.apellido}</p>
                                            <p className="pg-sub">{t.tecnico?.telefono}</p>
                                        </td>
                                        <td><span className="pg-desc" title={t.descripcion}>{t.descripcion}</span></td>
                                        <td><div style={{display:'flex',justifyContent:'center',gap:'0.25rem'}}>
                                            <Link to={`/dashboard/tickets/editar/${t._id}`} className="pg-edit">Editar</Link>
                                            <button onClick={() => handleEliminar(t._id)} className="pg-del">Anular</button>
                                        </div></td>
                                    </tr>
                                ))}
                                {tickets.length === 0 && <tr className="pg-empty"><td colSpan="5">No hay tickets de soporte activos.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tickets