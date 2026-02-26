import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'

import Login from './pages/Login'
import DashboardLayout from './layout/DashboardLayout'
import Tecnicos from './pages/Tecnicos'
import FormularioTecnico from './pages/FormularioTecnico'

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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App