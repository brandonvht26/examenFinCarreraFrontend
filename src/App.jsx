import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'

import Login from './pages/Login'
import DashboardLayout from './layout/DashboardLayout'

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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App