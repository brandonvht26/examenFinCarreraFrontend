import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthProvider'

const DashboardLayout = () => {
    const { auth, cerrarSesion } = useContext(AuthContext)
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { to: '/dashboard',           label: 'Inicio',            icon: '🏠', exact: true },
        { to: '/dashboard/tecnicos',  label: 'Técnicos',          icon: '👨‍💻' },
        { to: '/dashboard/clientes',  label: 'Clientes',          icon: '🏢' },
        { to: '/dashboard/tickets',   label: 'Tickets (Órdenes)', icon: '🎫' },
    ]

    const isActive = (link) =>
        link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body, #root { width: 100%; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

                :root {
                    --navy:   #0F172A;
                    --navy-2: #1E293B;
                    --navy-3: #334155;
                    --blue:   #3B82F6;
                    --blue-d: #1D4ED8;
                    --slate:  #94A3B8;
                    --sw: 255px;
                }

                .dash-root { display: flex; min-height: 100vh; width: 100%; background: #F1F5F9; }

                /* SIDEBAR */
                .ts-sidebar {
                    width: var(--sw); min-height: 100vh;
                    background: var(--navy);
                    display: flex; flex-direction: column; flex-shrink: 0;
                    position: sticky; top: 0; height: 100vh; overflow-y: auto;
                    z-index: 40; transition: transform 0.3s ease;
                }
                .ts-brand {
                    padding: 2rem 1.5rem 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .ts-brand h2 {
                    font-family: 'Syne', sans-serif;
                    font-size: 1.6rem; font-weight: 800; color: #fff;
                }
                .ts-brand h2 span { color: #60A5FA; }
                .ts-brand p {
                    font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase;
                    color: rgba(255,255,255,0.25); margin-top: 0.2rem;
                }
                .ts-nav { padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
                .ts-nav-label {
                    font-size: 0.63rem; font-weight: 700; letter-spacing: 2.5px;
                    text-transform: uppercase; color: rgba(255,255,255,0.22);
                    padding: 0.5rem 0.75rem 0.25rem; margin-top: 0.5rem;
                }
                .ts-nav-link {
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 0.7rem 1rem; border-radius: 10px;
                    text-decoration: none; font-weight: 600; font-size: 0.875rem;
                    color: rgba(255,255,255,0.55); transition: background 0.15s, color 0.15s;
                }
                .ts-nav-link:hover { background: rgba(255,255,255,0.05); color: #fff; }
                .ts-nav-link.active {
                    background: linear-gradient(135deg, #1D4ED8, #3B82F6);
                    color: #fff; font-weight: 700;
                    box-shadow: 0 4px 14px rgba(29,78,216,0.4);
                }
                .ts-nav-icon { font-size: 1rem; }

                .ts-footer {
                    padding: 1.25rem 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .ts-user { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
                .ts-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: linear-gradient(135deg, #1D4ED8, #3B82F6);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 0.8rem; color: #fff; flex-shrink: 0;
                }
                .ts-user-info p { font-size: 0.82rem; font-weight: 600; color: #F1F5F9; }
                .ts-user-info span { font-size: 0.7rem; color: rgba(255,255,255,0.3); }
                .ts-logout {
                    width: 100%; padding: 0.6rem;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.22); border-radius: 8px;
                    color: #FCA5A5; font-family: 'DM Sans', sans-serif;
                    font-size: 0.8rem; font-weight: 700; cursor: pointer;
                    transition: background 0.15s;
                }
                .ts-logout:hover { background: rgba(239,68,68,0.2); }

                /* MAIN */
                .ts-main { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 100vh; }
                .ts-topbar {
                    background: #fff; padding: 1rem 2rem;
                    border-bottom: 3px solid #3B82F6;
                    display: flex; align-items: center; justify-content: space-between;
                    position: sticky; top: 0; z-index: 30;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
                }
                .ts-topbar-txt { font-size: 0.8rem; font-weight: 600; color: #94A3B8; letter-spacing: 0.5px; text-transform: uppercase; }
                .ts-topbar-txt span { color: #0F172A; font-weight: 700; }
                .ts-content { padding: 2rem; flex: 1; }

                /* Hamburger */
                .ts-hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
                .ts-hamburger span { display: block; width: 22px; height: 2px; background: #334155; border-radius: 2px; }
                .ts-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 35; }

                @media (max-width: 768px) {
                    .ts-sidebar { position: fixed; top: 0; left: 0; height: 100%; transform: translateX(-100%); }
                    .ts-sidebar.open { transform: translateX(0); }
                    .ts-overlay.open { display: block; }
                    .ts-hamburger { display: flex; }
                    .ts-topbar { padding: 1rem; }
                    .ts-content { padding: 1.25rem; }
                }
            `}</style>

            <div className="dash-root">
                <div className={`ts-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

                <aside className={`ts-sidebar ${menuOpen ? 'open' : ''}`}>
                    <div className="ts-brand">
                        <h2>Tecno<span>Sys</span></h2>
                        <p>Portal de Asistencia</p>
                    </div>
                    <nav className="ts-nav">
                        <span className="ts-nav-label">Menú Principal</span>
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to}
                                className={`ts-nav-link ${isActive(link) ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}>
                                <span className="ts-nav-icon">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="ts-footer">
                        <div className="ts-user">
                            <div className="ts-avatar">{auth.nombre?.[0]}{auth.apellido?.[0]}</div>
                            <div className="ts-user-info">
                                <p>{auth.nombre} {auth.apellido}</p>
                                <span>Despachador</span>
                            </div>
                        </div>
                        <button className="ts-logout" onClick={cerrarSesion}>Cerrar Sesión</button>
                    </div>
                </aside>

                <div className="ts-main">
                    <header className="ts-topbar">
                        <p className="ts-topbar-txt">Bienvenido, <span>{auth.nombre} {auth.apellido}</span></p>
                        <button className="ts-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                            <span /><span /><span />
                        </button>
                    </header>
                    <div className="ts-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout