import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'

import Login from './pages/Login'
import DashboardLayout from './layout/DashboardLayout'
import Tecnicos from './pages/Tecnicos'
import FormularioTecnico from './pages/FormularioTecnico'
import Clientes from './pages/Clientes'
import FormularioCliente from './pages/FormularioCliente'
import Tickets from './pages/Tickets'
import FormularioTicket from './pages/FormularioTicket'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas Privadas */}
          <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={
                  <div className='text-center mt-20'>
                      <h1 className='text-4xl font-bold text-slate-800'>Centro de Control HelpDesk</h1>
                      <p className='text-xl text-slate-500 mt-4'>Seleccione un módulo en el menú lateral para gestionar los tickets de soporte.</p>
                  </div>
              } />
              {/* --- RUTAS DE TÉCNICOS --- */}
              <Route path="tecnicos" element={<Tecnicos />} />
              <Route path="tecnicos/crear" element={<FormularioTecnico />} />
              <Route path="tecnicos/editar/:id" element={<FormularioTecnico />} />
              {/* --- RUTAS DE CLIENTES --- */}
              <Route path="clientes" element={<Clientes />} />
              <Route path="clientes/crear" element={<FormularioCliente />} />
              <Route path="clientes/editar/:id" element={<FormularioCliente />} />
              {/* --- RUTAS DE TICKETS --- */}
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/crear" element={<FormularioTicket />} />
              <Route path="tickets/editar/:id" element={<FormularioTicket />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App