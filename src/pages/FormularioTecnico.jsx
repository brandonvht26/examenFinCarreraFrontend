import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const formStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    .ft-page { font-family:'DM Sans',sans-serif; }
    .ft-card { background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.07);max-width:820px;margin:0 auto;overflow:hidden; }
    .ft-head { background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);padding:1.75rem 2rem;border-bottom:3px solid #3B82F6; }
    .ft-head p { font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#60A5FA;margin-bottom:0.3rem; }
    .ft-head h1 { font-family:'Syne',sans-serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:700;color:#fff; }
    .ft-body { padding:2rem;display:flex;flex-direction:column;gap:0; }
    .ft-section { padding-bottom:1.5rem;margin-bottom:1.5rem;border-bottom:1px solid #F1F5F9; }
    .ft-section:last-child { border-bottom:none;padding-bottom:0;margin-bottom:0; }
    .ft-section-title { font-size:0.67rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563EB;margin-bottom:1rem; }
    .ft-grid-3 { display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem; }
    .ft-label { display:block;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;margin-bottom:0.4rem; }
    .ft-input, .ft-select { width:100%;padding:0.8rem 1rem;border:1.5px solid #E2E8F0;border-radius:10px;background:#F8FAFC;color:#0F172A;font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;box-sizing:border-box; }
    .ft-input:focus, .ft-select:focus { border-color:#3B82F6;background:#EFF6FF;box-shadow:0 0 0 3px rgba(59,130,246,0.15); }
    .ft-input:disabled { background:#F1F5F9;color:#94A3B8;cursor:not-allowed; }
    .ft-footer { display:flex;gap:1rem;flex-wrap:wrap;padding:1.5rem 2rem;background:#F8FAFC;border-top:1px solid #F1F5F9; }
    .ft-submit { flex:1;min-width:160px;padding:0.875rem 1rem;background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff;font-family:'DM Sans',sans-serif;font-weight:800;font-size:0.9rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(29,78,216,0.3);transition:transform 0.15s,box-shadow 0.15s; }
    .ft-submit:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(29,78,216,0.4); }
    .ft-cancel { flex:1;min-width:140px;padding:0.875rem 1rem;background:#fff;color:#334155;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.9rem;border:1.5px solid #CBD5E1;border-radius:10px;cursor:pointer;transition:background 0.15s; }
    .ft-cancel:hover { background:#F1F5F9; }
    @media (max-width:700px) { .ft-grid-3 { grid-template-columns:1fr; } }
    @media (max-width:560px) { .ft-body { padding:1.25rem; } .ft-footer { padding:1.25rem; } }
`

const FormularioTecnico = () => {
    const [tecnico, setTecnico] = useState({
        nombre: '', apellido: '', cedula: '', fecha_nacimiento: '',
        genero: '', ciudad: '', direccion: '', telefono: '', email: ''
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            clienteAxios.get(`/tecnico/${id}`).then(({ data }) => {
                const fechaFormat = data.fecha_nacimiento?.includes('T') ? data.fecha_nacimiento.split('T')[0] : data.fecha_nacimiento
                setTecnico({ ...data, fecha_nacimiento: fechaFormat })
            }).catch(() => { Swal.fire('Error', 'No se pudo cargar la información del técnico', 'error'); navigate('/dashboard/tecnicos') })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleChange = (e) => setTecnico({ ...tecnico, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(tecnico).includes('')) { Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning'); return }
        try {
            if (id) { await clienteAxios.put(`/tecnico/${id}`, tecnico); Swal.fire('¡Actualizado!', 'Datos del técnico actualizados correctamente', 'success') }
            else { await clienteAxios.post('/tecnicos', tecnico); Swal.fire('¡Registrado!', 'El técnico ha sido incorporado al sistema', 'success') }
            navigate('/dashboard/tecnicos')
        } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error en el servidor', 'error') }
    }

    return (
        <>
            <style>{formStyles}</style>
            <div className="ft-page">
                <div className="ft-card">
                    <div className="ft-head">
                        <p>{id ? 'Edición' : 'Registro'} · Técnicos</p>
                        <h1>{id ? 'Editar Ficha del Técnico' : 'Registrar Nuevo Técnico'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="ft-body">
                            <div className="ft-section">
                                <p className="ft-section-title">Identificación</p>
                                <div className="ft-grid-3">
                                    <div><label className="ft-label">Cédula *</label><input type="text" name="cedula" value={tecnico.cedula} onChange={handleChange} className="ft-input" placeholder="Ej: 1712345678" disabled={!!id} /></div>
                                    <div><label className="ft-label">Nombres *</label><input type="text" name="nombre" value={tecnico.nombre} onChange={handleChange} className="ft-input" /></div>
                                    <div><label className="ft-label">Apellidos *</label><input type="text" name="apellido" value={tecnico.apellido} onChange={handleChange} className="ft-input" /></div>
                                </div>
                            </div>
                            <div className="ft-section">
                                <p className="ft-section-title">Datos Demográficos</p>
                                <div className="ft-grid-3">
                                    <div><label className="ft-label">Fecha Nacimiento *</label><input type="date" name="fecha_nacimiento" value={tecnico.fecha_nacimiento} onChange={handleChange} className="ft-input" /></div>
                                    <div><label className="ft-label">Género *</label>
                                        <select name="genero" value={tecnico.genero} onChange={handleChange} className="ft-select">
                                            <option value="">-- Seleccione --</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                    <div><label className="ft-label">Teléfono *</label><input type="text" name="telefono" value={tecnico.telefono} onChange={handleChange} className="ft-input" placeholder="Ej: 0991234567" /></div>
                                </div>
                            </div>
                            <div className="ft-section">
                                <p className="ft-section-title">Contacto y Ubicación</p>
                                <div className="ft-grid-3">
                                    <div><label className="ft-label">Email *</label><input type="email" name="email" value={tecnico.email} onChange={handleChange} className="ft-input" placeholder="correo@ejemplo.com" /></div>
                                    <div><label className="ft-label">Ciudad Base *</label><input type="text" name="ciudad" value={tecnico.ciudad} onChange={handleChange} className="ft-input" placeholder="Ej: Guayaquil" /></div>
                                    <div><label className="ft-label">Dirección *</label><input type="text" name="direccion" value={tecnico.direccion} onChange={handleChange} className="ft-input" placeholder="Calle Principal y Secundaria" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="ft-footer">
                            <button type="submit" className="ft-submit">{id ? 'Guardar Cambios' : 'Registrar Técnico'}</button>
                            <button type="button" className="ft-cancel" onClick={() => navigate('/dashboard/tecnicos')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioTecnico