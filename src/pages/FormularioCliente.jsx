import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const formStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    .ff-page { font-family:'DM Sans',sans-serif; }
    .ff-card { background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.07);max-width:820px;margin:0 auto;overflow:hidden; }
    .ff-head { background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);padding:1.75rem 2rem;border-bottom:3px solid #3B82F6; }
    .ff-head p { font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#60A5FA;margin-bottom:0.3rem; }
    .ff-head h1 { font-family:'Syne',sans-serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:700;color:#fff; }
    .ff-body { padding:2rem;display:flex;flex-direction:column;gap:0; }
    .ff-section { padding-bottom:1.5rem;margin-bottom:1.5rem;border-bottom:1px solid #F1F5F9; }
    .ff-section:last-child { border-bottom:none;padding-bottom:0;margin-bottom:0; }
    .ff-section-title { font-size:0.67rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563EB;margin-bottom:1rem; }
    .ff-grid-3 { display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem; }
    .ff-grid-2 { display:grid;grid-template-columns:repeat(2,1fr);gap:1.1rem; }
    .ff-label { display:block;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;margin-bottom:0.4rem; }
    .ff-label.accent { color:#2563EB; }
    .ff-input, .ff-select {
        width:100%;padding:0.8rem 1rem;border:1.5px solid #E2E8F0;border-radius:10px;
        background:#F8FAFC;color:#0F172A;font-family:'DM Sans',sans-serif;font-size:0.875rem;
        outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;box-sizing:border-box;
    }
    .ff-input:focus, .ff-select:focus { border-color:#3B82F6;background:#EFF6FF;box-shadow:0 0 0 3px rgba(59,130,246,0.15); }
    .ff-input:disabled { background:#F1F5F9;color:#94A3B8;cursor:not-allowed; }
    .ff-footer { display:flex;gap:1rem;flex-wrap:wrap;padding:1.5rem 2rem;background:#F8FAFC;border-top:1px solid #F1F5F9; }
    .ff-submit { flex:1;min-width:160px;padding:0.875rem 1rem;background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff;font-family:'DM Sans',sans-serif;font-weight:800;font-size:0.9rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(29,78,216,0.3);transition:transform 0.15s,box-shadow 0.15s; }
    .ff-submit:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(29,78,216,0.4); }
    .ff-cancel { flex:1;min-width:140px;padding:0.875rem 1rem;background:#fff;color:#334155;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.9rem;border:1.5px solid #CBD5E1;border-radius:10px;cursor:pointer;transition:background 0.15s; }
    .ff-cancel:hover { background:#F1F5F9; }
    @media (max-width:700px) { .ff-grid-3 { grid-template-columns:1fr; } }
    @media (max-width:560px) { .ff-grid-2 { grid-template-columns:1fr; } .ff-body { padding:1.25rem; } .ff-footer { padding:1.25rem; } }
`

const FormularioCliente = () => {
    const [cliente, setCliente] = useState({
        cedula: '', nombre: '', apellido: '', ciudad: '',
        email: '', direccion: '', telefono: '', fecha_nacimiento: '', dependencia: ''
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            clienteAxios.get(`/cliente/${id}`).then(({ data }) => {
                const fechaFormat = data.fecha_nacimiento?.includes('T') ? data.fecha_nacimiento.split('T')[0] : data.fecha_nacimiento
                setCliente({ ...data, fecha_nacimiento: fechaFormat })
            }).catch(() => { Swal.fire('Error', 'No se pudo cargar la información del cliente', 'error'); navigate('/dashboard/clientes') })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleChange = (e) => setCliente({ ...cliente, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(cliente).includes('')) { Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning'); return }
        try {
            if (id) { await clienteAxios.put(`/cliente/${id}`, cliente); Swal.fire('¡Actualizado!', 'Datos del cliente actualizados', 'success') }
            else { await clienteAxios.post('/clientes', cliente); Swal.fire('¡Registrado!', 'El cliente ha sido ingresado al sistema', 'success') }
            navigate('/dashboard/clientes')
        } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error en el servidor', 'error') }
    }

    return (
        <>
            <style>{formStyles}</style>
            <div className="ff-page">
                <div className="ff-card">
                    <div className="ff-head">
                        <p>{id ? 'Edición' : 'Registro'} · Clientes</p>
                        <h1>{id ? 'Editar Ficha del Cliente' : 'Registrar Nuevo Solicitante'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="ff-body">
                            <div className="ff-section">
                                <p className="ff-section-title">Identificación</p>
                                <div className="ff-grid-3">
                                    <div><label className="ff-label">Cédula *</label><input type="text" name="cedula" value={cliente.cedula} onChange={handleChange} className="ff-input" placeholder="Ej: 1712345678" disabled={!!id} /></div>
                                    <div><label className="ff-label">Nombres *</label><input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} className="ff-input" /></div>
                                    <div><label className="ff-label">Apellidos *</label><input type="text" name="apellido" value={cliente.apellido} onChange={handleChange} className="ff-input" /></div>
                                </div>
                            </div>
                            <div className="ff-section">
                                <p className="ff-section-title">Área y Contacto</p>
                                <div className="ff-grid-3">
                                    <div><label className="ff-label accent">Dependencia (Área) *</label><input type="text" name="dependencia" value={cliente.dependencia} onChange={handleChange} className="ff-input" placeholder="Ej: Contabilidad, RRHH..." /></div>
                                    <div><label className="ff-label">Email *</label><input type="email" name="email" value={cliente.email} onChange={handleChange} className="ff-input" placeholder="empleado@empresa.com" /></div>
                                    <div><label className="ff-label">Teléfono *</label><input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} className="ff-input" /></div>
                                </div>
                            </div>
                            <div className="ff-section">
                                <p className="ff-section-title">Datos Adicionales</p>
                                <div className="ff-grid-3">
                                    <div><label className="ff-label">Fecha Nacimiento *</label><input type="date" name="fecha_nacimiento" value={cliente.fecha_nacimiento} onChange={handleChange} className="ff-input" /></div>
                                    <div><label className="ff-label">Ciudad *</label><input type="text" name="ciudad" value={cliente.ciudad} onChange={handleChange} className="ff-input" placeholder="Ej: Quito" /></div>
                                    <div><label className="ff-label">Dirección *</label><input type="text" name="direccion" value={cliente.direccion} onChange={handleChange} className="ff-input" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="ff-footer">
                            <button type="submit" className="ff-submit">{id ? 'Guardar Cambios' : 'Registrar Cliente'}</button>
                            <button type="button" className="ff-cancel" onClick={() => navigate('/dashboard/clientes')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioCliente