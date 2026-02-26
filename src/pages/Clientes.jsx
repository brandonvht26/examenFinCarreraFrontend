import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

// ── Estilos compartidos para las 3 tablas ──
const tableStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    .pg-wrap { font-family: 'DM Sans', sans-serif; }
    .pg-header {
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
        padding-bottom: 1.25rem; border-bottom: 2px solid #BFDBFE;
    }
    .pg-title { font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 800; color: #0F172A; }
    .pg-title span {
        display: block; font-size: 0.72rem; font-weight: 500;
        color: #94A3B8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 0.1rem;
    }
    .pg-btn-add {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: linear-gradient(135deg, #1D4ED8, #3B82F6);
        color: #fff; font-family: 'DM Sans', sans-serif;
        font-weight: 700; font-size: 0.875rem; padding: 0.65rem 1.25rem;
        border-radius: 10px; text-decoration: none;
        box-shadow: 0 4px 14px rgba(29,78,216,0.3);
        transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
    }
    .pg-btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(29,78,216,0.4); }
    .pg-card {
        background: #fff; border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        overflow: hidden; border: 1px solid #E2E8F0;
    }
    .pg-tbl-wrap { overflow-x: auto; }
    .pg-tbl { width: 100%; border-collapse: collapse; min-width: 500px; }
    .pg-tbl thead tr { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); }
    .pg-tbl thead th {
        padding: 1rem 1.1rem; font-size: 0.7rem; font-weight: 700;
        letter-spacing: 1.5px; text-transform: uppercase;
        color: rgba(255,255,255,0.6); white-space: nowrap;
    }
    .pg-tbl thead th:first-child { color: #60A5FA; }
    .pg-tbl tbody tr { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
    .pg-tbl tbody tr:last-child { border-bottom: none; }
    .pg-tbl tbody tr:hover { background: #EFF6FF; }
    .pg-tbl tbody td { padding: 0.9rem 1.1rem; font-size: 0.875rem; color: #334155; }
    .pg-code { font-weight: 800; font-size: 0.8rem; color: #2563EB; text-transform: uppercase; }
    .pg-badge {
        display: inline-block; background: #DBEAFE; color: #1E40AF;
        font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.65rem;
        border-radius: 99px; border: 1px solid #BFDBFE; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .pg-email { color: #2563EB; font-weight: 600; font-size: 0.82rem; }
    .pg-sub   { color: #94A3B8; font-size: 0.78rem; margin-top: 1px; }
    .pg-edit {
        color: #2563EB; font-weight: 700; font-size: 0.85rem;
        text-decoration: none; padding: 0.3rem 0.65rem; border-radius: 6px; transition: background 0.15s;
    }
    .pg-edit:hover { background: #DBEAFE; }
    .pg-del {
        color: #EF4444; font-weight: 700; font-size: 0.85rem;
        background: none; border: none; cursor: pointer;
        padding: 0.3rem 0.65rem; border-radius: 6px;
        font-family: 'DM Sans', sans-serif; transition: background 0.15s;
    }
    .pg-del:hover { background: #FEE2E2; }
    .pg-empty td { padding: 3rem 1rem; text-align: center; color: #94A3B8; font-size: 0.875rem; }
`

// ════════════════════════════════════
// CLIENTES
// ════════════════════════════════════
export const Clientes = () => {
    const [clientes, setClientes] = useState([])

    useEffect(() => {
        clienteAxios.get('/clientes').then(({ data }) => setClientes(data)).catch(console.log)
    }, [])

    const handleEliminar = async (id) => {
        const ok = await Swal.fire({
            title: '¿Eliminar Cliente?', text: 'El perfil de este solicitante será borrado del sistema.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#1D4ED8',
            cancelButtonColor: '#64748B', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
        })
        if (ok.isConfirmed) {
            try {
                await clienteAxios.delete(`/cliente/${id}`)
                setClientes(clientes.filter(c => c._id !== id))
                Swal.fire('¡Eliminado!', 'El cliente ha sido retirado del directorio.', 'success')
            } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error al eliminar', 'error') }
        }
    }

    return (
        <>
            <style>{tableStyles}</style>
            <div className="pg-wrap">
                <div className="pg-header">
                    <div className="pg-title"><span>Módulo</span>Directorio de Clientes (Empleados)</div>
                    <Link to="/dashboard/clientes/crear" className="pg-btn-add">+ Nuevo Solicitante</Link>
                </div>
                <div className="pg-card">
                    <div className="pg-tbl-wrap">
                        <table className="pg-tbl">
                            <thead><tr>
                                <th>Cédula</th><th>Solicitante</th>
                                <th>Dependencia (Área)</th><th>Contacto</th>
                                <th style={{textAlign:'center'}}>Acciones</th>
                            </tr></thead>
                            <tbody>
                                {clientes.map(c => (
                                    <tr key={c._id}>
                                        <td style={{fontWeight:700}}>{c.cedula}</td>
                                        <td style={{fontWeight:600, color:'#0F172A'}}>{c.nombre} {c.apellido}</td>
                                        <td><span className="pg-badge">{c.dependencia}</span></td>
                                        <td><p className="pg-email">{c.email}</p><p className="pg-sub">{c.telefono}</p></td>
                                        <td><div style={{display:'flex',justifyContent:'center',gap:'0.25rem'}}>
                                            <Link to={`/dashboard/clientes/editar/${c._id}`} className="pg-edit">Editar</Link>
                                            <button onClick={() => handleEliminar(c._id)} className="pg-del">Eliminar</button>
                                        </div></td>
                                    </tr>
                                ))}
                                {clientes.length === 0 && <tr className="pg-empty"><td colSpan="5">No hay clientes registrados en el sistema.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Clientes