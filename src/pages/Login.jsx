import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/axios'
import AuthContext from '../context/AuthProvider'
import Swal from 'sweetalert2'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { setAuth } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if ([email, password].includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            const { data } = await clienteAxios.post('/login', { email, password })
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/dashboard')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: error.response?.data?.msg || "Usuario o contraseña incorrectos"
            })
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body, #root { width: 100%; min-height: 100vh; }

                :root {
                    --navy:      #0F172A;
                    --navy-2:    #1E293B;
                    --navy-3:    #334155;
                    --steel:     #475569;
                    --blue:      #3B82F6;
                    --blue-lt:   #60A5FA;
                    --slate-lt:  #94A3B8;
                    --surface:   #1E293B;
                }

                .login-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    width: 100%;
                    background-color: var(--navy);
                    background-image:
                        radial-gradient(ellipse 70% 55% at 5% 0%,   rgba(59,130,246,0.18) 0%, transparent 60%),
                        radial-gradient(ellipse 55% 45% at 95% 100%, rgba(71,85,105,0.3)  0%, transparent 55%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.12; pointer-events: none; }
                .blob-1 { width: 450px; height: 450px; background: #3B82F6; top: -130px; left: -110px; animation: bfloat 9s ease-in-out infinite; }
                .blob-2 { width: 320px; height: 320px; background: #475569; bottom: -90px; right: -70px; animation: bfloat 11s ease-in-out infinite reverse; }
                @keyframes bfloat { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-22px) scale(1.04); } }

                .login-wrapper {
                    display: flex;
                    width: 100%;
                    max-width: 980px;
                    min-height: 560px;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.12);
                    position: relative;
                    z-index: 1;
                }

                /* Left panel */
                .login-left {
                    flex: 1;
                    background: linear-gradient(145deg, #1D4ED8 0%, #1E3A5F 50%, #0F2645 100%);
                    padding: 3rem 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }
                .left-pattern {
                    position: absolute; inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E");
                    pointer-events: none;
                }
                /* Grid decorativo */
                .left-grid {
                    position: absolute; inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                }
                .left-brand { position: relative; }
                .left-eyebrow {
                    font-size: 0.68rem; font-weight: 600; letter-spacing: 3px;
                    text-transform: uppercase; color: #93C5FD; margin-bottom: 0.5rem;
                }
                .left-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    font-weight: 800; color: #fff; line-height: 1.1;
                }
                .left-title span { color: #93C5FD; }
                .left-features { list-style: none; padding: 0; position: relative; }
                .left-features li {
                    display: flex; align-items: center; gap: 0.7rem;
                    color: rgba(255,255,255,0.8); font-size: 0.875rem;
                    font-weight: 500; margin-bottom: 0.85rem;
                }
                .feat-icon {
                    width: 28px; height: 28px; border-radius: 7px;
                    background: rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem; flex-shrink: 0;
                }
                .left-footer { font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 1.5px; text-transform: uppercase; position: relative; }

                /* Right panel */
                .login-right {
                    flex: 1;
                    background: #0F172A;
                    padding: clamp(2rem, 5vw, 3.5rem);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .form-eyebrow {
                    font-size: 0.68rem; font-weight: 600; letter-spacing: 3px;
                    text-transform: uppercase; color: #60A5FA; margin-bottom: 0.4rem;
                }
                .form-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(1.6rem, 3vw, 2.1rem);
                    font-weight: 800; color: #F1F5F9; margin-bottom: 0.4rem;
                }
                .form-sub { font-size: 0.875rem; color: #475569; margin-bottom: 2.5rem; }
                .fl-group { margin-bottom: 1.25rem; }
                .fl-label {
                    display: block; font-size: 0.7rem; font-weight: 600;
                    letter-spacing: 2px; text-transform: uppercase;
                    color: #475569; margin-bottom: 0.45rem;
                }
                .fl-input {
                    width: 100%; padding: 0.875rem 1rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px; color: #F1F5F9;
                    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
                    outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }
                .fl-input::placeholder { color: rgba(255,255,255,0.18); }
                .fl-input:focus {
                    border-color: #3B82F6;
                    background: rgba(59,130,246,0.07);
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
                }
                .fl-btn {
                    width: 100%; padding: 1rem; margin-top: 0.75rem;
                    background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%);
                    color: #fff; font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem; font-weight: 700; letter-spacing: 1.5px;
                    text-transform: uppercase; border: none; border-radius: 10px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(29,78,216,0.45);
                    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
                }
                .fl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(29,78,216,0.55); filter: brightness(1.08); }
                .fl-btn:active { transform: translateY(0); }
                .fl-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 2rem 0 1.25rem; }
                .fl-note { font-size: 0.78rem; color: #334155; text-align: center; line-height: 1.5; }
                .fl-note strong { color: #60A5FA; font-weight: 600; }

                @media (max-width: 640px) {
                    .login-wrapper { flex-direction: column; min-height: unset; border-radius: 16px; }
                    .login-left { padding: 2rem 1.5rem; min-height: 160px; }
                    .left-features { display: none; }
                    .left-footer { display: none; }
                    .login-right { padding: 2rem 1.5rem 2.5rem; }
                }
            `}</style>

            <div className="login-root">
                <div className="blob blob-1" />
                <div className="blob blob-2" />

                <div className="login-wrapper">
                    <div className="login-left">
                        <div className="left-pattern" />
                        <div className="left-grid" />
                        <div className="left-brand">
                            <p className="left-eyebrow">Sistema de Helpdesk</p>
                            <h1 className="left-title">Tecno<span>Sys</span></h1>
                        </div>
                        <ul className="left-features">
                            <li><span className="feat-icon">🎫</span>Gestión de tickets y órdenes</li>
                            <li><span className="feat-icon">👨‍💻</span>Directorio de técnicos</li>
                            <li><span className="feat-icon">🏢</span>Registro de solicitantes</li>
                            <li><span className="feat-icon">📊</span>Panel de control centralizado</li>
                        </ul>
                        <p className="left-footer">Exclusivo para despachadores</p>
                    </div>

                    <div className="login-right">
                        <p className="form-eyebrow">Acceso al sistema</p>
                        <h2 className="form-title">Inicia sesión</h2>
                        <p className="form-sub">Ingresa tus credenciales para continuar</p>

                        <form onSubmit={handleSubmit}>
                            <div className="fl-group">
                                <label className="fl-label">Correo electrónico</label>
                                <input type="email" className="fl-input" placeholder="test@test.com"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="fl-group">
                                <label className="fl-label">Contraseña</label>
                                <input type="password" className="fl-input" placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="fl-btn">Ingresar al Portal</button>
                        </form>

                        <div className="fl-divider" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login